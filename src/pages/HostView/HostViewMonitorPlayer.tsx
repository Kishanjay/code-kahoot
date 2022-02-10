import React from "react"
import { Heading, Level } from "../../components"
import { GameRoundPlayerSubmission } from "../../models/gameRoundPlayerSubmission.model"
import Editor from "@monaco-editor/react"

export default function HostViewMonitorPlayer(props: any) {
  const playerSubmission: GameRoundPlayerSubmission = props.submission
  const playerId: string = props.playerId
  const playerName: string = props.name

  return (
    <section className="border-2 w-1/3" data-attr-id={playerId}>
      <Level>
        <Heading as="h1">{playerName}</Heading>
        <div>
          {playerSubmission.currentNumberOfPassingUnitTests}
          <div>{playerSubmission.timeTaken}</div>
        </div>
      </Level>
      {playerSubmission ? (
        <div>
          <Editor
            height="400px"
            theme="vs-dark"
            defaultLanguage="typescript"
            value={playerSubmission.currentSolution}
            options={{ readOnly: true }}
          />
          <div>{playerSubmission.isFinished}</div>
        </div>
      ) : (
        <div className="bg-gray-100">No submission</div>
      )}
    </section>
  )
}
