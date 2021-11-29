import { getAuth, signInAnonymously, User } from "firebase/auth"

export async function login(): Promise<User> {
  const auth = getAuth()

  if (auth.currentUser) {
    // contains the loggedin user
    return auth.currentUser
  }

  return signInAnonymously(auth).then((res) => {
    console.log({ res })
    // Signed in..
    console.log("signed in!!")
    return res.user
  })
}

export function register() {
  console.log("register")
}

export function resetPassword() {
  console.log("reset pass")
}
