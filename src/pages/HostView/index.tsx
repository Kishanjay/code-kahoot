import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components"

import { GameRoom } from "../../models/gameRoom.model"
import { gameRoomRepo } from "../../repositories/factory"

import settings from "../../settings"
import HostViewEditor from "./HostViewEditor"
import HostViewMonitor from "./HostViewMonitor"

export default function Host() {
  const gameId = "somethingsomething"
  const [game, setGame] = useState<GameRoom>() // Synced with realtime database
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gameRoomRepo.subscribeToGameRoom(gameId, (g: GameRoom) => {
      setGame(g)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <h1>Loading game</h1>
  }

  if (!game) {
    return <h1>Game could not be found</h1>
  }

  return (
    <>
      <nav className="bg-white border-b-4">
        <div className="container mx-auto py-4">
          <Link
            className="flex items-center text-yellow-600 text-base xl:text-xl no-underline hover:no-underline font-extrabold font-sans"
            to="/"
          >
            <svg
              className="fill-current h-6 inline-block text-yellow-600 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16 2h4v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V0h16v2zm0 2v13a1 1 0 0 0 1 1 1 1 0 0 0 1-1V4h-2zM2 2v15a1 1 0 0 0 1 1h11.17a2.98 2.98 0 0 1-.17-1V2H2zm2 8h8v2H4v-2zm0 4h8v2H4v-2zM4 4h8v4H4V4z" />
            </svg>
            {settings.name} / Host
          </Link>
        </div>
      </nav>
      <main className="bg-gradient-to-tr from-white via-white to-white bg-opacity-5">
        {!game.gameHasStarted && <HostViewEditor game={game} />}
        {game.gameHasStarted && <HostViewMonitor game={game} />}
      </main>
    </>
  )
}
