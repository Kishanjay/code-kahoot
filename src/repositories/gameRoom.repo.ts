import { get, set, ref, Database, update, onValue } from "firebase/database"
import { GameRoom } from "../models/gameRoom.model"
import { GameRound } from "../models/gameRound.model"
export class GameRoomRepo {
  private _db: Database

  public constructor(db: Database) {
    this._db = db
  }

  public async listGameRooms(): Promise<GameRoom[]> {
    const snapshot = await get(ref(this._db, "gameRooms"))
    if (snapshot.exists()) {
      return snapshot.val()
    }

    return [] as GameRoom[]
  }

  public async subscribeToGameRoom(gameId: string, callback: any) {
    // const gameRoomRef = ref(this._db, "gameRooms/" + gameId)

    // onValue(gameRoomRef, (snapshot) => {
    //   const data = snapshot.val()
    //   console.log({ method: "readCallback", data: data })
    //   callback(data)
    // })

    callback({
      id: Math.floor(Math.random() * 100000).toString(), // random 6 digit number
      gameHostPlayerId: "some id",
      gameName: "some gamename",
      description: "default description",

      gameHasStarted: false,
      gameRounds: [
        {
          title: "Test",
          description: "Hello",
          unitTests: [{ input: "test", expectedOutput: "hello world" }],
          players: {
            "32424": {
              currentSolution: "let me try something here",
              numberOfPassingUnitTests: 10,
              isFinished: false,
              timeTaken: "12939",
            },
            "12234": {
              currentSolution: "Super easy shizz",
              numberOfPassingUnitTests: 19,
              isFinished: true,
              timeTaken: "384",
            },
          },
        },
        {
          title: "Test",
          description: "Hello",
          unitTests: [{ input: "test", expectedOutput: "hello world" }],
          players: {},
        },
        {
          title: "Test",
          description: "Hello",
          unitTests: [{ input: "test", expectedOutput: "hello world" }],
          players: {},
        },
      ],
      currentGameRound: "0",
      players: {
        "32424": { name: "Kishan" },
        "12234": { name: "Jayant" },
        "23949": { name: "RandomGuy" },
      },
    } as GameRoom)
  }

  public createGameRoom(game: Partial<GameRoom>): Promise<void> {
    return set(ref(this._db, "gameRooms/" + game.id), game)
  }

  public async updateGameRoom(
    gameId: string,
    game: Partial<GameRoom>
  ): Promise<void> {
    const { id, gameHostPlayerId, ...gameUpdate } = game // prevent un-updatable variables from getting in
    return update(ref(this._db, "gameRooms/" + gameId), gameUpdate)
  }

  public async addGameRound(
    gameId: string,
    gameRoundId: number,
    gameRound: any
  ) {
    // TODO add safety checks?

    return set(
      ref(this._db, "gameRooms/" + gameId + "/gameRounds/" + gameRoundId),
      gameRound
    )
  }

  public async startGame(gameId: string) {
    return update(ref(this._db, "gameRooms/" + gameId), {
      gameHasStarted: true,
    })
  }

  // PLAYER FUNCTIONS
  public playerJoinGame(gameId: string, playerUid: string) {
    return set(
      ref(this._db, "gameRooms/" + gameId + "/players/" + playerUid),
      true
    )
  }
  public async playerSubmitGameRound(
    gameId: string,
    gameRoundId: string,
    playerId: string,
    playerData: any
  ) {
    return set(
      ref(
        this._db,
        "gameRooms/" +
          gameId +
          "/gameRounds/" +
          gameRoundId +
          "/players/" +
          playerId
      ),
      playerData
    )
  }
}
