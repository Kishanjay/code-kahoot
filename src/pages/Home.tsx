import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button } from "../components"
import Input from "../components/Input"
import { GameRoom } from "../models/gameRoom.model"
import { gameRoomRepo } from "../repositories/factory"
import { createGameRoom, joinGame } from "../services/gameRoom.service"

import Navbar from "./_partials/Navbar"

enum HomeMode {
  DEFAULT,
  HOST,
  JOIN,
}
export default function Home() {
  const history = useHistory()
  const [joinGameRoomId, setJoinGameRoomId] = useState("")
  const [newGameRoomName, setNewGameRoomName] = useState("")

  async function hostNewGame() {
    const gameRoom = await createGameRoom(gameRoomRepo, joinGameRoomId)

    const gameRoomId = gameRoom.id
    history.push("/hostview/" + gameRoomId)
  }

  async function joinExistingGame() {
    const game = await joinGame(joinGameRoomId)

    history.push("/gameview/" + joinGameRoomId)
  }

  const [homeMode, setHomeMode] = useState(HomeMode.DEFAULT)

  return (
    <div className="h-screen pb-14 bg-right bg-cover">
      <Navbar />

      <div className="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1 className="my-4 text-3xl md:text-5xl text-purple-800 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">
            Challenge your friends and collegues
          </h1>
          <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">
            Find out in a fun and interactive way who is the best coder among
            us!
          </p>

          {homeMode === HomeMode.DEFAULT && (
            <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
              <Button
                className="mr-2"
                variant="secondary"
                onClick={() => setHomeMode(HomeMode.HOST)}
              >
                Host a game
              </Button>
              <Button onClick={() => setHomeMode(HomeMode.JOIN)}>
                Join a game
              </Button>
            </div>
          )}

          {homeMode === HomeMode.HOST && (
            <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
              <Input placeholder="Roomname" onChange={setNewGameRoomName} />
              <Button variant="accent" onClick={() => hostNewGame()}>
                HOST GAME
              </Button>
            </div>
          )}

          {homeMode === HomeMode.JOIN && (
            <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
              <Input placeholder="RoomId" onChange={setJoinGameRoomId} />
              <Button variant="primary" onClick={() => joinExistingGame()}>
                JOIN GAME
              </Button>
            </div>
          )}
        </div>

        <div className="w-full pt-16 pb-6 text-sm text-center md:text-left">
          <a
            className="text-gray-500 no-underline hover:no-underline"
            href="https://www.twitter.com/kishannirghin"
          >
            &copy; Copyright 2021
          </a>
        </div>
      </div>
    </div>
  )
}
