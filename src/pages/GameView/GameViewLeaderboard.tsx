import React from "react"
import { Heading, Level } from "../../components"

export type LeaderBoardData = {
  id: string
  name: string
  numberOfPassingUnitTests: number
  totalUnitTests: number
}[]

type GameViewLeaderboardProps = {
  data: LeaderBoardData
}

export default function GameViewLeaderboard(props: GameViewLeaderboardProps) {
  const leaderBoardData = props.data

  return (
    <>
      <Heading as="h2">Leaderboard</Heading>
      <ol>
        {leaderBoardData.map((l) => {
          return (
            <li
              className="block rounded-md bg-purple-50 px-2 py-4 mt-2"
              key={l.id}
            >
              <Level>
                <Heading as="h3">{l.name}</Heading>
                <Heading as="span" asStyle="h3">
                  {l.numberOfPassingUnitTests}/{l.totalUnitTests}
                </Heading>
              </Level>
            </li>
          )
        })}
      </ol>
    </>
  )
}
