import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    initializeTestApp,
    RulesTestEnvironment,
    loadDatabaseRules,
} from "@firebase/rules-unit-testing"
import { assert } from "console";

import firebaseCompat from 'firebase/compat/app';

import { connectDatabaseEmulator, set as _set, get, ref, Database } from "firebase/database";
import { GameRoom } from "./src/models/gameRoom.model";

import { GameRoomRepo } from "./src/repositories/gameRoom.repo";

const fs = require('fs');

let dbConnection: RulesTestEnvironment = undefined;

/**
 * Initializes a database connection to be used with the firebase emulator
 */
async function initDbConnection(){
  dbConnection = await initializeTestEnvironment({
    projectId: "code-kahoot-kn",
    database: {
      host: 'localhost',
      port: 9000,
      rules: fs.readFileSync("database.rules.jsonc", "utf8"),
    },
  });
}

/**
 * Gets a firebase realtime database instance
 *
 * @param {String} user_id User id to be associated with the connection
 * @returns {RulesTestEnvironment} Firebase database environment connected to
 * the emulator
 */
function getDatabase(user_id?: string): Database {
  let compatDatabase: firebaseCompat.database.Database;

  if (user_id) {
    compatDatabase = dbConnection.authenticatedContext(user_id, { }).database()
  } else {
    compatDatabase = dbConnection.unauthenticatedContext().database();
  }

  // Solves inconsistency in type definition between Database within
  // firebase/rules-unit-testing and Database within firebase/database
  return { ...compatDatabase, 'type': 'database' };
}

beforeAll(async() => {
  await initDbConnection();
})

beforeEach(async () => {
  await dbConnection.clearDatabase();
})

describe('Gameroom CREATE', () => {
  it('Denies UNAUTHENTICATED users to CREATE gameRooms', async () => {
    const db = getDatabase();
    const gameRoomRepo = new GameRoomRepo(db);

    const gameRoom = { gameRoomId: "unauth-create", gameHostPlayerId: "unauth-guy"};
    await assertFails(gameRoomRepo.createGameRoom(gameRoom));
  });

  it('Allows AUTHENTICATED users to CREATE gameRooms', async () => {
    const userId = "auth-create";
    const db = getDatabase(userId);

    const gameRoomRepo = new GameRoomRepo(db);

    const gameRoom = { gameRoomId: "auth-create", gameHostPlayerId: userId };
    await assertSucceeds(gameRoomRepo.createGameRoom(gameRoom));
  });

  it('Denies AUTHENTICATED users to CREATE gameroom FOR ANOTHER USER', async () => {
    const userId = "auth-create-another";
    const anotherUserId = "another";
    const db = getDatabase(userId);
    const gameRoomRepo = new GameRoomRepo(db);

    const gameRoom = { gameRoomId: "auth-create-another", gameHostPlayerId: anotherUserId};
    await assertFails(gameRoomRepo.createGameRoom(gameRoom));
  });

  it('Denies AUTHENTICATED users to HIJACK a gameroom', async () => {
    const userId = "auth-hijack";
    const anotherUserId = "auth-hijack-another";

    const db = getDatabase(userId);
    const anotherDb = getDatabase(anotherUserId);

    const gameRoomRepo = new GameRoomRepo(db);

    const anotherGameRoomRepo = new GameRoomRepo(anotherDb);

    const gameRoom: Partial<GameRoom> = { id: "hijack-test", gameHostPlayerId: userId };
    await assertSucceeds(gameRoomRepo.createGameRoom(gameRoom));
    await assertFails(anotherGameRoomRepo.createGameRoom({ ...gameRoom, gameHostPlayerId: anotherUserId }));

    const gameRooms = await gameRoomRepo.listGameRooms();
    expect(gameRooms[gameRoom.id].gameHostPlayerId).toBe(gameRoom.gameHostPlayerId);
  });
})

describe('Gameroom UPDATE', () => {
  const DEFAULT_USER_ID = 'default-user'
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: 'default-gameroom',
    gameName: "Welcome to Sparta",
    gameHostPlayerId: DEFAULT_USER_ID,
    currentGameRound: "0",
    gameHasStarted: false,
    gameRounds: [
      {
        title: 'Hello World',
        description: 'Who?',
        players: {},
        unitTests: [],
      },
      {
        title: 'next round',
        description: 'Who are yuu?',
        players: {},
        unitTests: [],
      }
    ]

  }
  let defaultGameRoomRepo: GameRoomRepo;

  beforeAll(async() => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID));
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM);
  });

  it('Denies UNAUTHENTICATED users to UPDATE gameRoom', async () => {
    const db = getDatabase();
    const gameRoomRepo = new GameRoomRepo(db);

    await assertFails(gameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, { gameName: 'something else'}));
  });

  it('Allows AUTHENTICATED users to UPDATE their gameRoom', async () => {
    await assertSucceeds(defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, { gameName: 'something else'}));
  });

  it('Denies AUTHENTICATED users to UPDATE the gameRoom OF ANOTHER USER', async () => {
    const db = getDatabase("another-user");
    const gameRoomRepo = new GameRoomRepo(db);

    await assertFails(gameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, { gameName: 'something else'}));
  });

  it('Allows AUTHENTICATED users to UPDATE the currentGameRound', async () => {
    await assertSucceeds(defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, { currentGameRound: DEFAULT_GAME_ROOM.currentGameRound+1}));
  });

  it('Allows AUTHENTICATED users to START the game', async () => {
    await assertSucceeds(defaultGameRoomRepo.updateGameRoom(DEFAULT_GAME_ROOM.id, { gameHasStarted: true }));
  });
});

describe('Gameroom ADD gameround', () => {
  const DEFAULT_USER_ID = 'default-user'
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: 'default-gameroom',
    gameHostPlayerId: DEFAULT_USER_ID
  }
  let defaultGameRoomRepo: GameRoomRepo;

  beforeAll(async() => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID));
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM);
  });

  it('Denies UNAUTHENTICATED users to ADD gameround', async () => {
    const db = getDatabase();
    const gameRoomRepo = new GameRoomRepo(db);

    await assertFails(gameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, 0, {
      title: 'gameroundtitle',
      description: 'gamerounddescription',
    }));
  });

  it('Denies AUTHENTICATED user to ADD gameround FOR ANOTHER USER', async () => {
    const db = getDatabase('another-user');
    const gameRoomRepo = new GameRoomRepo(db);

    await assertFails(gameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, 0, {
      title: 'gameroundtitle',
      description: 'gamerounddescription',
    }));
  });

  it('Allows AUTHENTICATED user to ADD gameround', async () => {
    await assertSucceeds(defaultGameRoomRepo.addGameRound(DEFAULT_GAME_ROOM.id, 0, {
      title: 'gameroundtitle',
      description: 'gamerounddescription',
    }));
  });
})

describe('Player SUBMIT gameround', () => {
  const DEFAULT_USER_ID = 'default-user'
  const DEFAULT_GAME_ROOM: Partial<GameRoom> = {
    id: 'default-gameroom',
    gameHostPlayerId: DEFAULT_USER_ID,
    currentGameRound: "0",
    gameHasStarted: true,
    gameRounds: [
      {
        title: 'Hello World',
        description: 'Who?',
        players: {},
        unitTests: [],
      },
      {
        title: 'next round',
        description: 'Who are yuu?',
        players: {},
        unitTests: [],
      }
    ]
  }
  let defaultGameRoomRepo: GameRoomRepo;

  beforeAll(async() => {
    // provision default object to use
    defaultGameRoomRepo = new GameRoomRepo(getDatabase(DEFAULT_USER_ID));
  })

  beforeEach(async () => {
    // assert a gameroom exists
    await defaultGameRoomRepo.createGameRoom(DEFAULT_GAME_ROOM);
  });

  it('Denies UNAUTHENTICATED users to SUBMIT gameround', async () => {
    const db = getDatabase();
    const gameRoomRepo = new GameRoomRepo(db);

    await assertFails(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound, undefined, {
      currentSolution: 'Some code that can be evaluated',
    }));
  });

  it('Allows AUTHENTICATED and JOINED users to SUBMIT gameround', async () => {
    const authUserId = 'auth-user';
    const db = getDatabase(authUserId);
    const gameRoomRepo = new GameRoomRepo(db);

    const roundSubmission = {
      currentSolution: 'Some code that can be evaluated'
    }
    await assertSucceeds(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound, authUserId, roundSubmission));

    const rooms = await gameRoomRepo.listGameRooms();
    expect(rooms['default-gameroom'].gameRounds[0].players[authUserId]).toStrictEqual(roundSubmission);
  });

  it('Allows AUTHENTICATED and JOINED users to RESUBMIT gameround', async () => {
    const authUserId = 'auth-user';
    const db = getDatabase(authUserId);
    const gameRoomRepo = new GameRoomRepo(db);

    const roundSubmission = {
      currentSolution: 'Some code that can be evaluated'
    }
    await assertSucceeds(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound, authUserId, roundSubmission));

    const anotherRoundSubmssion = {
      currentSolution: 'Some code that can be evaluated, and has been extended with extra data'
    }
    await assertSucceeds(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound, authUserId, anotherRoundSubmssion));

    const rooms = await gameRoomRepo.listGameRooms();
    expect(rooms['default-gameroom'].gameRounds[0].players[authUserId]).toStrictEqual(anotherRoundSubmssion);
  });

  it('Denies AUTHENTICATED and JOINED users to SUBMIT gameround FOR ANOTHER USER', async () => {
    const authUserId = 'auth-user';
    const db = getDatabase(authUserId);
    const gameRoomRepo = new GameRoomRepo(db);

    const roundSubmission = {
      currentSolution: 'Some code that can be evaluated'
    }
    await assertFails(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound, "another-user", roundSubmission));
  });

  it('Denies AUTHENTICATED and JOINED users to SUBMIT FUTURE gameround', async () => {
    const authUserId = 'auth-user';
    const db = getDatabase(authUserId);
    const gameRoomRepo = new GameRoomRepo(db);

    const roundSubmission = {
      currentSolution: 'Some code that can be evaluated'
    }
    await assertFails(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound+1, authUserId, roundSubmission));
  });

  it('Denies AUTHENTICATED and JOINED users to SUBMIT NON EXISTING gameround', async () => {
    const authUserId = 'auth-user';
    const db = getDatabase(authUserId);
    const gameRoomRepo = new GameRoomRepo(db);

    const roundSubmission = {
      currentSolution: 'Some code that can be evaluated'
    }
    await assertFails(gameRoomRepo.playerSubmitGameRound(DEFAULT_GAME_ROOM.id, DEFAULT_GAME_ROOM.currentGameRound+10, authUserId, roundSubmission));
  });
})
// const fs = require('fs');
// const path = require('path');

// const TEST_FIREBASE_PROJECT_ID = 'test-firestore-rules-project';

// const firebase = require('@firebase/rules-unit-testing');
// const firebaseAdmin = require('firebase-admin');

// process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// const adminDb = firebase
//   .initializeAdminApp({
//     projectId: TEST_FIREBASE_PROJECT_ID,
//   })
//   .firestore();

// const aliceAuth = {
//   uid: 'alice',
//   email: 'alice@example.com',
// };
// const aliceDb = firebase
//   .initializeTestApp({
//     projectId: TEST_FIREBASE_PROJECT_ID,
//     auth: aliceAuth,
//   })
//   .firestore();

// const ADMIN_DELETED_FIELD = firebaseAdmin.firestore.FieldValue.delete();
// const DELETED_FIELD = firebase.firestore.FieldValue.delete();

// const eveAuth = {
//   uid: 'eve',
//   email: 'eve@example.com',
// };
// const eveDb = firebase
//   .initializeTestApp({
//     projectId: TEST_FIREBASE_PROJECT_ID,
//     auth: eveAuth,
//   })
//   .firestore();

// const bobAuth = {
//   uid: 'bob',
//   email: 'bob@example.com',
// };
// const bobDb = firebase
//   .initializeTestApp({
//     projectId: TEST_FIREBASE_PROJECT_ID,
//     auth: bobAuth,
//   })
//   .firestore();

// beforeAll(async () => {
//   // Load the content of the "firestore.rules" file into the emulator before running the
//   // test suite. This is necessary because we are using a fake Project ID in the tests,
//   // so the rules "hot reloading" behavior which works in the Web App does not apply here.
//   const rulesContent = fs.readFileSync(path.resolve(__dirname, 'firestore.rules'), 'utf-8');
//   await firebase.loadFirestoreRules({
//     projectId: TEST_FIREBASE_PROJECT_ID,
//     rules: rulesContent,
//   });
// });

// afterAll(async () => {
//   await Promise.allSettled(firebase.apps().map((app) => app.delete()));
// });

// describe('user creation', () => {
//   afterEach(async () => {
//     await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
//   });

//   test('users can create a valid entry for itself', async () => {
//     await firebase.assertSucceeds(aliceDb.doc('users/' + aliceAuth.uid).set({}));
//     await firebase.assertSucceeds(
//       aliceDb.doc('users/' + aliceAuth.uid).set({
//         uniqlo: {
//           broek: 'xx',
//         },
//       }),
//     );
//   });

//   test('users cannot create an entry for someone else', async () => {
//     await firebase.assertFails(
//       aliceDb.doc('users/' + eveAuth.uid).set({
//         uniqlo: {
//           broek: 'xs',
//         },
//       }),
//     );
//   });

//   test('users cannot create an entry for an unknown user', async () => {
//     await firebase.assertFails(
//       aliceDb.doc('users/asdfdasf').set({
//         uniqlo: {
//           broek: 'xs',
//         },
//       }),
//     );
//   });
// });

// describe('user store management', () => {
//   afterEach(async () => {
//     await adminDb.doc('users/' + aliceAuth.uid).set({});
//   });
//   afterEach(async () => {
//     await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
//   });

//   test('users can set the stores for themselves', async () => {
//     await firebase.assertSucceeds(
//       aliceDb.doc(`users/${aliceAuth.uid}`).set({
//         uniqlo: {
//           broek: 'xs',
//         },
//       }),
//     );

//     await firebase.assertSucceeds(
//       eveDb.doc(`users/${eveAuth.uid}`).set({
//         uniqlo: {
//           broek: 'xs',
//         },
//       }),
//     );
//   });
// });

// describe('friend_requests', () => {
//   beforeAll(async () => {
//     await adminDb.doc('users/' + aliceAuth.uid).set({});
//     await adminDb.doc('users/' + eveAuth.uid).set({});
//     await adminDb.doc('users/' + bobAuth.uid).set({});
//     await adminDb.doc('friend_requests/' + eveAuth.uid).set({ test: 'random', test2: 'random2' });
//     await adminDb.doc('friend_requests/' + aliceAuth.uid).set({});
//     await adminDb.doc('friend_requests/' + bobAuth.uid).set({});
//   });
//   afterAll(async () => {
//     await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
//   });

//   test('users can send out friend requests', async () => {
//     await adminDb
//       .doc(`friend_requests/${eveAuth.uid}`)
//       .update({ [aliceAuth.uid]: ADMIN_DELETED_FIELD });

//     await firebase.assertSucceeds(
//       aliceDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true }),
//     );
//   });

//   test('users can withdraw friend request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true });

//     await firebase.assertSucceeds(
//       aliceDb.doc(`friend_requests/${eveAuth.uid}`).update({ alice: DELETED_FIELD }),
//     );
//   });

//   test('users can see their own friend request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true });
//     await firebase.assertSucceeds(aliceDb.doc(`friend_requests/${eveAuth.uid}`).get());
//   });

//   test('users cannot see friend requests when they have no business', async () => {
//     await adminDb
//       .doc(`friend_requests/${eveAuth.uid}`)
//       .update({ [aliceAuth.uid]: ADMIN_DELETED_FIELD });

//     await firebase.assertFails(aliceDb.doc(`friend_requests/${eveAuth.uid}`).get());
//   });

//   test('users can ONLY withdraw its own friend request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true });

//     await firebase.assertFails(aliceDb.doc(`friend_requests/${eveAuth.uid}`).set({}));
//   });

//   test('owner can delete any friend request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true });

//     await firebase.assertSucceeds(eveDb.doc(`friend_requests/${eveAuth.uid}`).set({}));
//   });

//   test('owner cannot make friend requests', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).set({ randomData: 'hello' });

//     await firebase.assertFails(
//       eveDb.doc(`friend_requests/${eveAuth.uid}`).update({ [eveAuth.uid]: true }),
//     );

//     await firebase.assertFails(
//       eveDb.doc(`friend_requests/${eveAuth.uid}`).update({ [aliceAuth.uid]: true }),
//     );
//   });

//   test('random user cannot delete friend_request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).set({ [aliceAuth.uid]: true });

//     await firebase.assertFails(bobDb.doc(`friend_requests/${eveAuth.uid}`).set({}));
//   });
// });

// describe('friends', () => {
//   beforeEach(async () => {
//     await adminDb.doc('users/' + aliceAuth.uid).set({});
//     await adminDb.doc('users/' + eveAuth.uid).set({});
//     await adminDb.doc('friend_requests/' + eveAuth.uid).set({});
//     await adminDb.doc('friend_requests/' + aliceAuth.uid).set({});
//     await adminDb.doc('friends/' + eveAuth.uid).set({});
//     await adminDb.doc('friends/' + aliceAuth.uid).set({});
//   });
//   afterAll(async () => {
//     await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
//   });

//   test('owners can promote a friend_request to a friend', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).set({ [aliceAuth.uid]: true });

//     await firebase.assertSucceeds(
//       eveDb.doc('friends/' + eveAuth.uid).update({
//         [aliceAuth.uid]: true,
//       }),
//     );
//   });

//   test('owners cannot add a friend without friend_request', async () => {
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).set({ randomUser: true });

//     await firebase.assertFails(
//       eveDb.doc('friends/' + eveAuth.uid).update({
//         [aliceAuth.uid]: true,
//       }),
//     );
//   });

//   test('owners can add themselves to the wannabe-friends friendlist', async () => {
//     // alice wants to be friends with eve
//     await adminDb.doc(`friend_requests/${eveAuth.uid}`).set({ [aliceAuth.uid]: true });

//     // eve can add herself to the friendlist of alice
//     await firebase.assertSucceeds(
//       eveDb.doc('friends/' + aliceAuth.uid).update({
//         [eveAuth.uid]: true,
//       }),
//     );
//   });

//   test('owners cannot add themselves to friendlist of not wannabe-friends', async () => {
//     // alice does not wants to be friends with eve
//     await adminDb
//       .doc(`friend_requests/${eveAuth.uid}`)
//       .update({ [aliceAuth.uid]: ADMIN_DELETED_FIELD });

//     // eve cannot add herself to the friendlist of alice
//     await firebase.assertFails(
//       eveDb.doc('friends/' + aliceAuth.uid).update({
//         [eveAuth.uid]: true,
//       }),
//     );
//   });
// });
