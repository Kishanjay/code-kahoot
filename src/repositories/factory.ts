/**
 * Repository factory to be used for the actual application. This factory will
 * take care of the DI layer for the app.
 *
 * At the moment this means that it does firebase authentication and connecting
 * and creates the corresponding repositories.
 */

import { getDatabase, connectDatabaseEmulator } from "firebase/database"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { GameRoomRepo } from "./gameRoom.repo"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Lazy way of importing the config
const firebaseConfig = JSON.parse(
  atob(process.env.REACT_APP_FIREBASE_CONFIG || btoa("{}"))
)

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getDatabase()
if (window.location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(db, "localhost", 9000)
}
console.log("factory", process.env)

export const gameRoomRepo = new GameRoomRepo(db)
