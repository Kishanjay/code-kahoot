import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import Editor from "@monaco-editor/react"

import { GameRoom } from "../../models/gameRoom.model"
import { user, login } from "../../repositories/auth.repo"
import { gameRoomRepo } from "../../repositories/factory"
import { Button, Heading, Level } from "../../components"
import { GameRoundUnitTest } from "../../models/gameRoundUnitTest"
import GameViewLeaderboard, { LeaderBoardData } from "./GameViewLeaderboard"

type GameViewParams = {
  gameRoomId: string
}

enum Status {
  WAITING,
  CODING,
  FINISHED,
}

export default function GameView() {
  const [timerValue, setTimerValue] = useState(0)
  const [status, setStatus] = useState(Status.WAITING)
  const [passingUnitTests, setPassingUnitTests] = useState(0)
  const [totalUnitTests, setTotalUnitTests] = useState(0)
  const { gameRoomId } = useParams<GameViewParams>()
  const [gameRoom, setGameRoom] = useState<GameRoom>() // Synced with realtime database
  const [challengeDescription, setChallengeDescription] = useState("")
  const [playerSolution, setPlayerSolution] = useState("")
  const [leaderboardData, setLeaderbordData] = useState<any>([])

  async function updatePlayerCode(code: string) {
    if (!gameRoom) {
      throw Error("Failed updating playerCode [GameRoom not found]")
    }

    await gameRoomRepo.playerUpdateGameRoundSubmission(
      gameRoomId,
      gameRoom?.currentGameRound,
      user.uid,
      { currentSolution: code }
    )
  }

  function submitSolution() {
    if (!gameRoom) {
      throw Error("Failed submitting solution [GameRoom not found]")
    }

    window.eval(playerSolution)
    const _window = window as unknown as { solve: (param: unknown) => unknown }
    if (!_window.solve && typeof _window !== "function") {
      throw Error("Please do not rename the function")
    }

    const gameRound = gameRoom.gameRounds[parseInt(gameRoom.currentGameRound)]
    const unitTests: GameRoundUnitTest[] = gameRound.unitTests
    let unitTestsPassed = 0
    for (const test of unitTests) {
      const output = _window.solve(test.input.split(","))
      if (test.expectedOutput === output) {
        unitTestsPassed++
      } else {
        console.log(
          `Expected ${test.expectedOutput} for input ${test.input}, Got ${output}`
        )
      }
    }

    const playerIsFinished = unitTestsPassed === totalUnitTests

    gameRoomRepo.playerUpdateGameRoundSubmission(
      gameRoomId,
      gameRoom?.currentGameRound,
      user.uid,
      {
        currentSolution: playerSolution,
        numberOfPassingUnitTests: unitTestsPassed,
        timeTaken: timerValue,
        isFinished: playerIsFinished,
      }
    )

    setPassingUnitTests(unitTestsPassed)
  }

  // trigger counter
  useEffect(() => {
    if (status === Status.CODING) {
      const timer = window.setInterval(() => {
        setTimerValue((prevTimerValue) => prevTimerValue + 0.1)
      }, 100)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  /**
   * OnLoad
   */
  useEffect(() => {
    if (!gameRoom) {
      return
    }
    const gameRound = gameRoom.gameRounds[parseInt(gameRoom.currentGameRound)]
    const currentChallengeDescription = gameRoom.gameHasStarted
      ? gameRound.description
      : "// Challenge will be shown once game starts"

    setChallengeDescription(currentChallengeDescription)
    setTotalUnitTests(gameRound.unitTests.length)
    setPlayerSolution(gameRound.players[user.uid]?.currentSolution || "")

    const _leaderboardData: LeaderBoardData = []
    for (const [playerId, playerSubmission] of Object.entries(
      gameRound.players
    )) {
      const playerName = gameRoom.players[playerId]?.name
      if (playerName) {
        _leaderboardData.push({
          id: playerId,
          name: playerName,
          numberOfPassingUnitTests:
            playerSubmission.numberOfPassingUnitTests || 0,
          totalUnitTests: gameRound.unitTests.length,
        })
      }
    }

    _leaderboardData.sort((a, b) => {
      if (!a.numberOfPassingUnitTests) {
        return 1
      }
      if (!b.numberOfPassingUnitTests) {
        return -1
      }
      return b.numberOfPassingUnitTests - a.numberOfPassingUnitTests
    })
    setLeaderbordData(_leaderboardData)

    if (gameRoom.gameHasStarted) {
      setStatus(Status.CODING)
    }
  }, [gameRoom])

  useEffect(() => {
    // TODO handle gameRoom not found case
    gameRoomRepo.subscribeToGameRoom(gameRoomId, (g: GameRoom) => {
      setGameRoom(g)
    })

    if (!user) {
      login()
    }
  }, [])

  if (!gameRoom) {
    return <h1>GameRoom not found</h1>
  }

  return (
    <div className="flex overflow-hidden">
      <main className="flex-auto relative h-screen">
        <div className="px-8 py-6">
          <Heading as="h1">Question 1</Heading>
          {challengeDescription}
        </div>
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="typescript"
          defaultValue={playerSolution}
          onChange={(val) => updatePlayerCode(val || "")}
        />
        {!gameRoom.gameHasStarted && (
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-70 flex items-center justify-center">
            <Heading as="h1">Waiting for host to start game</Heading>
          </div>
        )}
      </main>

      <aside className="flex-initial flex flex-col justify-between w-96">
        <div className="px-4 py-8">
          <GameViewLeaderboard data={leaderboardData} />
        </div>

        <footer className="py-6 px-4 rounded-xl bg-gray-200 m-2">
          <div className="flex flex-col">
            <Level>
              <Heading as="h2">Solution</Heading>
              <Heading as="h3">
                {passingUnitTests}/{totalUnitTests}
              </Heading>
            </Level>
            <ul>
              <li>
                <Heading as="h4">Number of attempts</Heading>2
              </li>
              <li>
                <Heading as="h4">Time elapsed</Heading>
                {timerValue.toFixed(1)}0
              </li>
            </ul>
            <Button onClick={() => submitSolution()}>Submit</Button>
          </div>
        </footer>
      </aside>
    </div>
  )
}
