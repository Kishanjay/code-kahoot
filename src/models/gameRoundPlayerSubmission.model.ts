export type GameRoundPlayerSubmission = {
  currentSolution: string
  currentNumberOfPassingUnitTests: number

  numberOfSubmissions: number

  isFinished: boolean
  timeTaken: number // TODO restrict so that only host can set this value
}
