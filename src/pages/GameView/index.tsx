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

enum RoundStatus {
  Loading,
  Coding,
  Finished,
}

export default function GameView() {
  const { gameRoomId } = useParams<GameViewParams>()

  const [roundStatus, setRoundStatus] = useState(RoundStatus.Loading)
  const [timerValue, setTimerValue] = useState(0)

  const [gameRoom, setGameRoom] = useState<GameRoom>() // Synced with realtime database
  const [playerSolution, setPlayerSolution] = useState("")
  const [passingUnitTests, setPassingUnitTests] = useState(0)
  const [totalUnitTests, setTotalUnitTests] = useState(0)
  const [numberOfSubmissions, setNumberOfSubmissions] = useState(-1)

  const [leaderboardData, setLeaderbordData] = useState<any>([])

  async function updatePlayerCode(code: string) {
    if (!gameRoom) {
      throw Error("Failed updating playerCode [GameRoom not found]")
    }

    await gameRoomRepo.playerUpdateGameRoundSubmission(
      gameRoomId,
      gameRoom?.currentGameRound.toString(),
      user.uid,
      { currentSolution: code }
    )
  }

  function _setTimerValue(fn: (old: number) => number) {
    if (roundStatus === RoundStatus.Finished) {
      return
    }

    setTimerValue(fn)
  }
  function submitSolution() {
    if (!gameRoom) {
      throw Error("Failed submitting solution [GameRoom not found]")
    }

    const gameRound = gameRoom.gameRounds[gameRoom.currentGameRound]
    const player = gameRound.players[user.uid]
    if (player.isFinished) {
      throw Error("You're already finished bruf")
    }

    window.eval(playerSolution)
    const _window = window as unknown as { solve: (param: unknown) => unknown }
    if (!_window.solve && typeof _window !== "function") {
      throw Error("Please do not rename the function")
    }

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
      gameRoom?.currentGameRound.toString(),
      user.uid,
      {
        currentSolution: playerSolution,
        currentNumberOfPassingUnitTests: unitTestsPassed,
        isFinished: playerIsFinished,
        timeTaken: timerValue,
        numberOfSubmissions: (player.numberOfSubmissions || 0) + 1,
      }
    )

    setPassingUnitTests(unitTestsPassed)
  }

  useEffect(() => {
    if (!gameRoom) {
      return
    }
    const gameRound = gameRoom.gameRounds[gameRoom.currentGameRound]
    const player = gameRound.players[user.uid]

    setTotalUnitTests(gameRound.unitTests.length)
    setPlayerSolution(player?.currentSolution || "")
    setNumberOfSubmissions(player?.numberOfSubmissions)
    setPassingUnitTests(player?.currentNumberOfPassingUnitTests)

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
            playerSubmission.currentNumberOfPassingUnitTests || 0,
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

    if (gameRound.players[user.uid].isFinished) {
      setRoundStatus(RoundStatus.Finished)
      return
    }

    if (!gameRound.players[user.uid].isFinished && gameRoom.gameHasStarted) {
      setRoundStatus(RoundStatus.Coding)
      const timer = window.setInterval(() => {
        _setTimerValue((prevTimerValue) => prevTimerValue + 0.1)
      }, 100)

      return () => {
        clearTimeout(timer)
      }
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
          <Heading as="h1">Question {gameRoom.currentGameRound + 1}</Heading>
          {gameRoom.gameRounds[gameRoom.currentGameRound].description}
        </div>
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="typescript"
          defaultValue={playerSolution}
          options={{ readOnly: roundStatus === RoundStatus.Finished }}
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
                <Heading as="h4">Number of attempts</Heading>
                {numberOfSubmissions}
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
