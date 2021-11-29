import { GameRound } from "./gameRound.model"

export type GameRoom = {
  id: string // unique identifier
  gameHostPlayerId: string

  gameName: string
  description: string

  gameHasStarted: boolean
  gameRounds: GameRound[]
  currentGameRound: number

  // Not sure yet what this player object should look like. This is only to
  // be used to keep track of which players are playing.
  players: {
    [pid: string]: {
      name: string
    }
  }
}
