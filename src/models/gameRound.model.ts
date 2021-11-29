import { GameRoundPlayerData } from "./gameRoundPlayerData.model"

export type GameRound = {
  title: string
  description: string

  players: {
    [id: string]: GameRoundPlayerData
  }

  unitTests: { input: string; expectedOutput: string }[]
}
