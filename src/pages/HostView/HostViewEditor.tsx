import React, { useState } from "react"
import { Button, Heading, Input } from "../../components"
import { GameRoom } from "../../models/gameRoom.model"
import { GameRound } from "../../models/gameRound.model"
import { GameRoundUnitTest } from "../../models/gameRoundUnitTest"
import { gameRoomRepo } from "../../repositories/factory"

export default function HostViewEditor(props: any) {
  const gameRoom: GameRoom = props.game

  async function addQuestion() {
    try {
      await gameRoomRepo.addGameRound(
        gameRoom.id,
        gameRoom.gameRounds.length.toString(),
        {}
      )
    } catch (e) {
      console.log(e)
    }
    console.log("added")
  }

  function startGame() {
    gameRoomRepo.startGame(gameRoom.id)
  }

  async function updateGameRound(
    gameRoundIndex: number,
    update: Partial<GameRound>
  ) {
    try {
      await gameRoomRepo.updateGameRound(
        gameRoom.id,
        gameRoundIndex.toString(),
        update
      )
    } catch (e) {
      console.log({ e })
    }
  }

  async function updateGameRoundUnitTest(
    gameRoundIndex: number,
    unitTestIndex: number,
    update: Partial<GameRoundUnitTest>
  ) {
    const gameRound = gameRoom.gameRounds[gameRoundIndex]
    const oldData = gameRound.unitTests?.[unitTestIndex] || {}
    const newData: GameRoundUnitTest = {
      ...oldData,
      ...update,
    }

    if (!newData.input && !newData.expectedOutput) {
      const newUnitTests = [...gameRound.unitTests]
      newUnitTests.splice(unitTestIndex, 1)
      await gameRoomRepo.updateGameRound(
        gameRoom.id,
        gameRoundIndex.toString(),
        {
          unitTests: newUnitTests || [],
        }
      )
      console.log("delete")
      console.log({ newUnitTests })
    } else {
      try {
        await gameRoomRepo.updateGameRoundUnitTest(
          gameRoom.id,
          gameRoundIndex.toString(),
          unitTestIndex.toString(),
          update
        )
      } catch (e) {
        console.log({ e })
      }
    }
  }

  return (
    <div className="container mx-auto flex flex-col pt-8">
      <header className="border-b-2 pb-8">
        <Heading as="h1">{gameRoom.gameName}</Heading>
        <h2>#{gameRoom.id}</h2>
      </header>

      <div className="">
        {gameRoom.gameRounds.map((gameRound, gameRoundIndex) => {
          return (
            <section className="mt-20" key={gameRoundIndex}>
              <Heading as="h2">Question {gameRoundIndex + 1}</Heading>

              <div className="mt-4">
                <Heading as="h3">Title</Heading>
                <Input
                  value={gameRound.title}
                  onChange={(val) =>
                    updateGameRound(gameRoundIndex, {
                      title: val,
                    })
                  }
                />
              </div>

              <div className="mt-4">
                <Heading as="h3">description</Heading>
                <textarea
                  value={gameRound.description}
                  placeholder="Enter the question here"
                  className="form-textarea mt-1 block w-full border-2 p-4"
                  rows={4}
                  onChange={(ev) =>
                    updateGameRound(gameRoundIndex, {
                      description: ev.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="mt-4">
                <Heading as="h3">Unittests</Heading>
                <ul>
                  {[
                    ...(gameRound.unitTests || []),
                    { input: "", expectedOutput: "" },
                  ].map((ut, unitTestIndex) => {
                    return (
                      <li key={unitTestIndex}>
                        <div className="flex">
                          <Input
                            placeholder="Input"
                            value={ut.input}
                            onChange={(val) =>
                              updateGameRoundUnitTest(
                                gameRoundIndex,
                                unitTestIndex,
                                { input: val }
                              )
                            }
                          />
                          <Input
                            placeholder="Expected output"
                            value={ut.expectedOutput}
                            onChange={(val) =>
                              updateGameRoundUnitTest(
                                gameRoundIndex,
                                unitTestIndex,
                                { expectedOutput: val }
                              )
                            }
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          )
        })}

        <div className="mt-12">
          <Button variant="secondary" onClick={() => addQuestion()}>
            Add question
          </Button>
        </div>
      </div>

      <footer className="w-full text-base md:text-sm text-gray-600 py-24 mb-12">
        <Button variant="accent" onClick={() => startGame()}>
          Start game - ({Object.keys(gameRoom.players || {}).length} players
          joined)
        </Button>
      </footer>
    </div>
  )
}
