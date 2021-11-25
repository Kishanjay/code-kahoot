export type GameRound = {
    title: string,
    description: string,
    
    players: {
        [id: string]: {
            currentSolution: string,
            numberOfPassingUnitTests: number,

            isFinished: boolean,
            timeTaken: number,
        } 
    }

    unitTests: { input: string, expectedOutput: string }[],
}