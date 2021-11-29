import { GameRoom } from "../models/gameRoom.model"
import { login } from "../repositories/auth.repo"
import { gameRoomRepo } from "../repositories/factory"
import { GameRoomRepo } from "../repositories/gameRoom.repo"

/**
 * End-to-end feature to creating new gamerooms.
 * creates a new gameroom given a host user
 */
export async function createGameRoom(
  gameRoomRepo: GameRoomRepo,
  gameName: string
): Promise<GameRoom> {
  // assert that there is a 'host' user
  const user = await login()

  const game = {
    id: Math.floor(Math.random() * 100000).toString(), // random 6 digit number
    gameHostPlayerId: user.uid,
    gameName: gameName,
    description: "default description",

    gameHasStarted: false,
    gameRounds: [
      {
        title: "Test",
        description: "Hello",
        unitTests: [{ input: "test", expectedOutput: "hello world" }],
        players: {},
      },
    ],
    currentGameRound: 0,
    players: {
      "32424": { name: "Kishan" },
      "12234": { name: "Jayant" },
    },
  }
  await gameRoomRepo.createGameRoom(game)

  return game
}

export async function joinGame(gameRoomId: string) {
  const user = await login()

  await gameRoomRepo.playerJoinGame(gameRoomId, user.uid)
}
