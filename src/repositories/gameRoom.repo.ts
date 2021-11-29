import {
  get,
  set,
  ref,
  Database,
  update,
  onValue,
  push,
} from "firebase/database"
import { GameRoom } from "../models/gameRoom.model"
import { GameRound } from "../models/gameRound.model"
import { GameRoundPlayerSubmission } from "../models/gameRoundPlayerSubmission.model"
import { GameRoundUnitTest } from "../models/gameRoundUnitTest"
export class GameRoomRepo {
  private _db: Database

  public constructor(db: Database) {
    this._db = db
  }

  public async subscribeToGameRoom(gameRoomId: string, callback: any) {
    const gameRoomRef = ref(this._db, "gameRooms/" + gameRoomId)

    onValue(gameRoomRef, (snapshot) => {
      const data = snapshot.val()
      console.log({ method: "readCallback", data: data })
      callback(data)
    })
  }

  public createGameRoom(game: Partial<GameRoom>): Promise<void> {
    return set(ref(this._db, "gameRooms/" + game.id), game)
  }

  public async listGameRooms(): Promise<GameRoom[]> {
    const snapshot = await get(ref(this._db, "gameRooms"))
    if (snapshot.exists()) {
      return snapshot.val()
    }

    return [] as GameRoom[]
  }

  public async updateGameRoom(
    gameRoomId: string,
    game: Partial<GameRoom>
  ): Promise<void> {
    const { id, gameHostPlayerId, ...gameUpdate } = game // prevent un-updatable variables from getting in
    return update(ref(this._db, "gameRooms/" + gameRoomId), gameUpdate)
  }

  public async addGameRound(
    gameRoomId: string,
    gameRoundId: string,
    gameRound: Partial<GameRound>
  ) {
    const path = `gameRooms/${gameRoomId}/gameRounds/${gameRoundId}`
    const id = Math.floor(Math.random() * 100000)
    return set(ref(this._db, path), { ...gameRound, id: id })
  }

  public async updateGameRound(
    gameRoomId: string,
    gameRoundId: string,
    gameRoundData: Partial<GameRound>
  ) {
    // TODO add safety checks
    return update(
      ref(this._db, "gameRooms/" + gameRoomId + "/gameRounds/" + gameRoundId),
      gameRoundData
    )
  }

  public async addGameRoundUnitTest(
    gameRoomId: string,
    gameRoundId: string,
    unitTestId: string,
    unitTest: GameRoundUnitTest
  ) {
    const path = `gameRooms/${gameRoomId}/gameRounds/${gameRoundId}/unitTests/${unitTestId}`
    console.log({ path, unitTest })
    return set(ref(this._db, path), unitTest)
  }

  public async updateGameRoundUnitTest(
    gameRoomId: string,
    gameRoundId: string,
    unitTestId: string,
    unitTest: Partial<GameRoundUnitTest>
  ) {
    const path = `gameRooms/${gameRoomId}/gameRounds/${gameRoundId}/unitTests/${unitTestId}`
    return update(ref(this._db, path), unitTest)
  }

  public async startGame(gameRoomId: string) {
    return update(ref(this._db, "gameRooms/" + gameRoomId), {
      gameHasStarted: true,
    })
  }

  // PLAYER FUNCTIONS
  public playerJoinGame(gameRoomId: string, playerUid: string) {
    return set(
      ref(this._db, "gameRooms/" + gameRoomId + "/players/" + playerUid),
      { name: "Anonymous" }
    )
  }

  public async playerUpdateGameRoundSubmission(
    gameRoomId: string,
    gameRoundId: string,
    playerId: string,
    submission: Partial<GameRoundPlayerSubmission>
  ) {
    const path = `gameRooms/${gameRoomId}/gameRounds/${gameRoundId}/players/${playerId}`
    return update(ref(this._db, path), submission)
  }

  public async playerSubmitGameRound(
    gameRoomId: string,
    gameRoundId: string,
    playerId: string,
    playerData: any
  ) {
    return set(
      ref(
        this._db,
        "gameRooms/" +
          gameRoomId +
          "/gameRounds/" +
          gameRoundId +
          "/players/" +
          playerId
      ),
      playerData
    )
  }
}
