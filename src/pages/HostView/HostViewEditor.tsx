import React from "react"
import { Button, Heading, Input } from "../../components"
import { GameRoom } from "../../models/gameRoom.model"
import { gameRoomRepo } from "../../repositories/factory"

export default function HostViewEditor(props: any) {
  const game: GameRoom = props.game

  function addQuestion() {
    gameRoomRepo.addGameRound(game.id, game.gameRounds.length, {})
  }

  function startGame() {
    gameRoomRepo.startGame(game.id)
  }

  return (
    <div className="container mx-auto flex flex-col pt-8">
      <header className="border-b-2 pb-8">
        <Heading as="h1">{game.gameName}</Heading>
        <h2>#{game.id}</h2>
      </header>

      <div className="">
        {game.gameRounds.map((gameRound, index) => {
          return (
            <section className="mt-16" key={gameRound.title}>
              <Heading as="h2">
                Question {index + 1} - {gameRound.title}
              </Heading>

              <textarea
                value={gameRound.description}
                placeholder="Enter the question here"
                className="form-textarea mt-1 block w-full border-2 p-4"
                rows={4}
              ></textarea>

              <div className="mt-2">
                <Heading as="h3">Unittests</Heading>
                <ul>
                  {gameRound.unitTests.map((ut, index) => {
                    return (
                      <li key={index}>
                        <div className="flex">
                          <Input placeholder="Input" value={ut.input} />
                          <Input
                            placeholder="Expected output"
                            value={ut.expectedOutput}
                          />
                        </div>
                      </li>
                    )
                  })}

                  <li>
                    <div className="flex">
                      <Input placeholder="Input" />
                      <Input placeholder="Expected output" />
                    </div>
                  </li>
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
          Start game - ({Object.keys(game.players).length} players joined)
        </Button>
      </footer>
    </div>
  )
}
