import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  initializeTestApp,
  RulesTestEnvironment,
  loadDatabaseRules,
} from "@firebase/rules-unit-testing"
import { assert } from "console"

import firebaseCompat from "firebase/compat/app"

import {
  connectDatabaseEmulator,
  set as _set,
  get,
  ref,
  Database,
} from "firebase/database"
import { GameRoom } from "./src/models/gameRoom.model"

import { GameRoomRepo } from "./src/repositories/gameRoom.repo"

import * as fs from "fs"

let dbConnection: RulesTestEnvironment = undefined

/**
 * Initializes a database connection to be used with the firebase emulator
 */
async function initDbConnection() {
  dbConnection = await initializeTestEnvironment({
    projectId: "code-kahoot-kn",
    database: {
      host: "localhost",
      port: 9000,
      rules: fs.readFileSync("database.rules.jsonc", "utf8"),
    },
  })
}

/**
 * Gets a firebase realtime database instance
 *
 * @param {String} user_id User id to be associated with the connection
 * @returns {RulesTestEnvironment} Firebase database environment connected to
 * the emulator
 */
function getDatabase(user_id?: string): Database {
  let compatDatabase: firebaseCompat.database.Database

  if (user_id) {
    compatDatabase = dbConnection.authenticatedContext(user_id, {}).database()
  } else {
    compatDatabase = dbConnection.unauthenticatedContext().database()
  }

  // Solves inconsistency in type definition between Database within
  // firebase/rules-unit-testing and Database within firebase/database
  return { ...compatDatabase, type: "database" }
}

beforeAll(async () => {
  await initDbConnection()
})

beforeEach(async () => {
  await dbConnection.clearDatabase()
})

describe("Gameroom CREATE", () => {
  it("Denies UNAUTHENTICATED users to CREATE gameRooms", async () => {
    const db = getDatabase()
    const gameRoomRepo = new GameRoomRepo(db)

    const gameRoom = {
      gameRoomId: "unauth-create",
      gameHostPlayerId: "unauth-guy",
    }
    await assertFails(gameRoomRepo.createGameRoom(gameRoom))
  })

  it("Allows AUTHENTICATED users to CREATE gameRooms", async () => {
    const userId = "auth-create"
    const db = getDatabase(userId)

    const gameRoomRepo = new GameRoomRepo(db)

    const gameRoom = { gameRoomId: "auth-create", gameHostPlayerId: userId }
    await assertSucceeds(gameRoomRepo.createGameRoom(gameRoom))
  })

  it("Denies AUTHENTICATED users to CREATE gameroom FOR ANOTHER USER", async () => {
    const userId = "auth-create-another"
    const anotherUserId = "another"
    const db = getDatabase(userId)
    const gameRoomRepo = new GameRoomRepo(db)

    const gameRoom = {
      gameRoomId: "auth-create-another",
      gameHostPlayerId: anotherUserId,
    }
    await assertFails(gameRoomRepo.createGameRoom(gameRoom))
  })

  it("Denies AUTHENTICATED users to HIJACK a gameroom", async () => {
    const userId = "auth-hijack"
    const anotherUserId = "auth-hijack-another"

    const db = getDatabase(userId)
    const anotherDb = getDatabase(anotherUserId)

    const gameRoomRepo = new GameRoomRepo(db)

    const anotherGameRoomRepo = new GameRoomRepo(anotherDb)

    const gameRoom: Partial<GameRoom> = {
      id: "hijack-test",
      gameHostPlayerId: userId,
    }
    await assertSucceeds(gameRoomRepo.createGameRoom(gameRoom))
    await assertFails(
      anotherGameRoomRepo.createGameRoom({
        ...gameRoom,
        gameHostPlayerId: anotherUserId,
      })
    )

    const gameRooms = await gameRoomRepo.listGameRooms()
    expect(gameRooms[gameRoom.id].gameHostPlayerId).toBe(
      gameRoom.gameHostPlayerId
    )
  })
})

describe("Gameroom UPDATE", () => {
  const DEFAULT_USER_ID = "default-user"
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: "default-gameroom",
    gameName: "Welcome to Sparta",
    gameHostPlayerId: DEFAULT_USER_ID,
    currentGameRound: "0",
    gameHasStarted: false,
    gameRounds: [
      {
        title: "Hello World",
        description: "Who?",
        players: {},
        unitTests: [],
      },
      {
        title: "next round",
        description: "Who are yuu?",
        players: {},
        unitTests: [],
      },
    ],
  }
  let defaultGameRoomRepo: GameRoomRepo

  beforeAll(async () => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID))
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM)
  })

  it("Denies UNAUTHENTICATED users to UPDATE gameRoom", async () => {
    const db = getDatabase()
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, {
        gameName: "something else",
      })
    )
  })

  it("Allows AUTHENTICATED users to UPDATE their gameRoom", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, {
        gameName: "something else",
      })
    )
  })

  it("Denies AUTHENTICATED users to UPDATE the gameRoom OF ANOTHER USER", async () => {
    const db = getDatabase("another-user")
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, {
        gameName: "something else",
      })
    )
  })

  it("Allows AUTHENTICATED users to UPDATE the currentGameRound", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, {
        currentGameRound: DEFAULT_GAME_ROOM.currentGameRound + 1,
      })
    )
  })

  it("Allows AUTHENTICATED users to START the game", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, {
        gameHasStarted: true,
      })
    )
  })
})

describe("Gameroom ADD gameround", () => {
  const DEFAULT_USER_ID = "default-user"
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: "default-gameroom",
    gameHostPlayerId: DEFAULT_USER_ID,
  }
  let defaultGameRoomRepo: GameRoomRepo

  beforeAll(async () => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID))
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM)
  })

  it("Denies UNAUTHENTICATED users to ADD gameround", async () => {
    const db = getDatabase()
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, "0", {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })

  it("Denies AUTHENTICATED user to ADD gameround FOR ANOTHER USER", async () => {
    const db = getDatabase("another-user")
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, 0, {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })

  it("Allows AUTHENTICATED user to ADD gameround", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, 0, {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })
})

describe("Gameroom UPDATE gameround", () => {
  const DEFAULT_USER_ID = "default-user"
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: "default-gameroom",
    gameHostPlayerId: DEFAULT_USER_ID,
    gameRounds: [{
      title: "default-gameround-title",
      description: "default-gameround-description",
      players: {},
      unitTests: [{
        input: "default-unittest-input",
        expectedOutput: "default-unittest-output"
      }]
    }]
  }
  let defaultGameRoomRepo: GameRoomRepo


  beforeAll(async () => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID))
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM)
  })

  it("Denies UNAUTHENTICATED users to UPDATE gameround", async () => {
    const db = getDatabase()
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, "0", {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })

  it("Denies AUTHENTICATED user to UPDATE gameround FOR ANOTHER USER", async () => {
    const db = getDatabase("another-user")
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.updateGameRound(DEFAULT_GAME_ROOM.id, "0", {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })

  it("Allows AUTHENTICATED user to UPDATE gameround", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.updateGameRound(DEFAULT_GAME_ROOM.id, "0", {
        title: "gameroundtitle",
        description: "gamerounddescription",
      })
    )
  })

  it("Allows AUTHENTICATED user to ADD gameround unittest", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.addGameRoundUnitTest(DEFAULT_GAME_ROOM.id, "0", "1", {
        input: "unittest-input",
        expectedOutput: "unittest-output"
      })
    )
  })


  it("Denies AUTHENTICATED user to ADD gameround unittest FOR ANOTHER USER", async () => {
    const db = getDatabase("another-user")
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.addGameRoundUnitTest(DEFAULT_GAME_ROOM.id, "0", "1", {
        input: "unittest-input",
        expectedOutput: "unittest-output"
      })
    )
  })

  it("Allows AUTHENTICATED user to UPDATE gameround unittest", async () => {
    await assertSucceeds(
      defaultGameRoomRepo.addGameRoundUnitTest(DEFAULT_GAME_ROOM.id, "0", "0", {
        input: "updated-unittest-input",
        expectedOutput: "updated-unittest-output"
      })
    )
  })

  it("Denies AUTHENTICATED user to UPDATE gameround unittest FOR ANOTHER USER", async () => {
    const db = getDatabase("another-user")
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.addGameRoundUnitTest(DEFAULT_GAME_ROOM.id, "0", "0", {
        input: "unittest-input",
        expectedOutput: "unittest-output"
      })
    )
  })
})

describe("Player SUBMIT gameround", () => {
  const DEFAULT_USER_ID = "default-user"
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: "default-gameroom",
    gameHostPlayerId: DEFAULT_USER_ID,
    currentGameRound: "0",
    gameHasStarted: true,
    gameRounds: [
      {
        title: "Hello World",
        description: "Who?",
        players: {},
        unitTests: [],
      },
      {
        title: "next round",
        description: "Who are yuu?",
        players: {},
        unitTests: [],
      },
    ],
  }
  let defaultGameRoomRepo: GameRoomRepo

  beforeAll(async () => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID))
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM)
  })

  it("Denies UNAUTHENTICATED users to SUBMIT gameround", async () => {
    const db = getDatabase()
    const gameRoomRepo = new GameRoomRepo(db)

    await assertFails(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound,
        undefined,
        {
          currentSolution: "Some code that can be evaluated",
        }
      )
    )
  })

  it("Allows AUTHENTICATED and JOINED users to SUBMIT gameround", async () => {
    const authUserId = "auth-user"
    const db = getDatabase(authUserId)
    const gameRoomRepo = new GameRoomRepo(db)

    const roundSubmission = {
      currentSolution: "Some code that can be evaluated",
    }
    await assertSucceeds(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound,
        authUserId,
        roundSubmission
      )
    )

    const rooms = await gameRoomRepo.listGameRooms()
    expect(
      rooms["default-gameroom"].gameRounds[0].players[authUserId]
    ).toStrictEqual(roundSubmission)
  })

  it("Allows AUTHENTICATED and JOINED users to RESUBMIT gameround", async () => {
    const authUserId = "auth-user"
    const db = getDatabase(authUserId)
    const gameRoomRepo = new GameRoomRepo(db)

    const roundSubmission = {
      currentSolution: "Some code that can be evaluated",
    }
    await assertSucceeds(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound,
        authUserId,
        roundSubmission
      )
    )

    const anotherRoundSubmssion = {
      currentSolution:
        "Some code that can be evaluated, and has been extended with extra data",
    }
    await assertSucceeds(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound,
        authUserId,
        anotherRoundSubmssion
      )
    )

    const rooms = await gameRoomRepo.listGameRooms()
    expect(
      rooms["default-gameroom"].gameRounds[0].players[authUserId]
    ).toStrictEqual(anotherRoundSubmssion)
  })

  it("Denies AUTHENTICATED and JOINED users to SUBMIT gameround FOR ANOTHER USER", async () => {
    const authUserId = "auth-user"
    const db = getDatabase(authUserId)
    const gameRoomRepo = new GameRoomRepo(db)

    const roundSubmission = {
      currentSolution: "Some code that can be evaluated",
    }
    await assertFails(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound,
        "another-user",
        roundSubmission
      )
    )
  })

  it("Denies AUTHENTICATED and JOINED users to SUBMIT FUTURE gameround", async () => {
    const authUserId = "auth-user"
    const db = getDatabase(authUserId)
    const gameRoomRepo = new GameRoomRepo(db)

    const roundSubmission = {
      currentSolution: "Some code that can be evaluated",
    }
    await assertFails(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound + 1,
        authUserId,
        roundSubmission
      )
    )
  })

  it("Denies AUTHENTICATED and JOINED users to SUBMIT NON EXISTING gameround", async () => {
    const authUserId = "auth-user"
    const db = getDatabase(authUserId)
    const gameRoomRepo = new GameRoomRepo(db)

    const roundSubmission = {
      currentSolution: "Some code that can be evaluated",
    }
    await assertFails(
      gameRoomRepo.playerSubmitGameRound(
        DEFAULT_GAME_ROOM.id,
        DEFAULT_GAME_ROOM.currentGameRound + 10,
        authUserId,
        roundSubmission
      )
    )
  })
})
