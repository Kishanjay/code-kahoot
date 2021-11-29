import { GameRoundPlayerSubmission } from "./gameRoundPlayerSubmission.model"
import { GameRoundUnitTest } from "./gameRoundUnitTest"

export type GameRound = {
  title: string
  description: string

  players: {
    [id: string]: GameRoundPlayerSubmission
  }

  unitTests: GameRoundUnitTest[]
}
