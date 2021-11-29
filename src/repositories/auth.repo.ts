import { getAuth, signInAnonymously, User } from "firebase/auth"

export let user: User

export async function login(): Promise<User> {
  const auth = getAuth()

  if (auth.currentUser) {
    // contains the loggedin user
    user = auth.currentUser
    return auth.currentUser
  }

  return signInAnonymously(auth).then((res) => {
    console.log({ res })
    // Signed in..
    console.log("signed in!!")
    user = res.user
    return res.user
  })
}

export function register() {
  console.log("register")
}

export function resetPassword() {
  console.log("reset pass")
}
