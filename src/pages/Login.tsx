import React, { useState } from "react"
import { Link } from "react-router-dom"
import { GameRoom } from "../models/gameRoom.model"

import { login } from "../repositories/auth.repo"
import { gameRoomRepo } from "../repositories/factory"

export default function Login() {
  const [uid, setUid] = useState("")

  function doLogin() {
    login().then((user: any) => {
      console.log(user.uid)
      setUid(user.uid)
    })
  }

  function test(ev: any) {
    console.log("Hello World", ev)

    // const game: GameRoom = {
    //   id: Math.floor(Math.random()*100000).toString(),
    //   gameHostPlayerId: uid, //Math.floor(Math.random()*100000) + " ",
    //   players: [],
    //     gameRounds: [],
    //     gameHasStarted: false,
    //   currentGameRound: "0",
    // }
    // gameRoomRepo.createGameRoom(game).then((res: any) => {
    //   // Data saved successfully!
    //   console.log("success");
    //   console.log({res})
    // })
    // .catch((error: any) => {
    //   // The write failed...
    //   console.log({error});
    // });
  }

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
          <Link to="/" className="bg-black text-white font-bold text-xl p-4">
            Code Kahoot
          </Link>
        </div>

        <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
          <p className="text-center text-3xl">Welcome. {uid}</p>
          <form
            className="flex flex-col pt-3 md:pt-8"
            onSubmit={(ev) => {
              ev.preventDefault()
              doLogin()
            }}
          >
            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <input
              type="submit"
              value="Log In"
              className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
            />
          </form>
          <div className="text-center pt-12 pb-12">
            <p>
              Don&apos;t have an account?{" "}
              <a href="register.html" className="underline font-semibold">
                Register here.
              </a>
            </p>
            <button
              className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
              onClick={(ev) => test(ev)}
            >
              Oke wat is dit
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2 shadow-2xl">
        <img
          className="object-cover w-full h-screen hidden md:block"
          src="https://source.unsplash.com/IXUM4cJynP0"
          alt="abstract banner"
        />
      </div>
    </div>
  )
}
