import { getAuth, signInAnonymously } from "firebase/auth"

export async function login() {
  const auth = getAuth()

  if (auth.currentUser) {
    // contains the loggedin user
    return auth.currentUser.uid
  }

  return signInAnonymously(auth)
    .then((res) => {
      console.log({ res })
      // Signed in..
      console.log("signed in!!")
      return res.user
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ...
    })
}

export function register() {
  console.log("register")
}

export function resetPassword() {
  console.log("reset pass")
}
