import { get, set, ref, Database, update } from "firebase/database"
import { GameRoom } from "../models/gameRoom.model"
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
    return set(
      ref(this._db, "gameRooms/" + gameId + "/gameRounds/" + gameRoundId),
      gameRound
    )
  }

  // PLAYER FUNCTIONS
  public playerJoinGame(game: GameRoom, playerUid: string) {
    return set(
      ref(this._db, "gameRooms/" + game.id + "/players/" + playerUid),
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
