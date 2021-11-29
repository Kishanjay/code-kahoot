import React from "react"
import { Heading, Level } from "../../components"
import { GameRoundPlayerData } from "../../models/gameRoundPlayerData.model"

export default function HostViewMonitorPlayer(props: any) {
  const playerSubmission: GameRoundPlayerData = props.submission
  const playerId: string = props.playerId
  const playerName: string = props.name

  return (
    <section className="border-2 flex-grow" data-attr-id={playerId}>
      <Level>
        <Heading as="h1">{playerName}</Heading>
        {playerSubmission?.isFinished && "Done"}
      </Level>
      {playerSubmission ? (
        <div>
          <p>{playerSubmission.currentSolution}</p>
          <div>{playerSubmission.numberOfPassingUnitTests}</div>
          <div>{playerSubmission.isFinished}</div>
          <div>{playerSubmission.timeTaken}</div>
        </div>
      ) : (
        <div className="bg-gray-100">No submission</div>
      )}
    </section>
  )
}
