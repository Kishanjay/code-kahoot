import React from "react"
import { Button, Heading } from "../../components"
import { GameRoom } from "../../models/gameRoom.model"
import { GameRound } from "../../models/gameRound.model"
import HostViewMonitorPlayer from "./HostViewMonitorPlayer"

export default function HostViewMonitor(props: any) {
  const game: GameRoom = props.game

  const currentGameRound: GameRound = game.gameRounds[game.currentGameRound]

  return (
    <div>
      <div className="flex">
        <Button>Next Question</Button>

        {game.gameRounds.map((g, i) => (
          <div
            key={i}
            className={`flex items-center justify-center w-16 h-16
              ${i < game.currentGameRound && "bg-green-100"}
              ${i === game.currentGameRound && "bg-red-100"}
              ${i > game.currentGameRound && "bg-gray-100"}
            `}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="flex">
        {Object.entries(game.players).map(([playerId, p]) => {
          return (
            <HostViewMonitorPlayer
              key={playerId}
              playerId={playerId}
              name={p.name}
              submission={currentGameRound.players[playerId]}
            />
          )
        })}
      </div>
    </div>
  )
}
