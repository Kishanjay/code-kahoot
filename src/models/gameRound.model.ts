export type GameRound = {
    title: string,
    description: string,
    
    players: {
        [id: string]: {
            solution: string,
            passingUnitTests: number,
            isCorrect: boolean,
            timeTaken: number,
        } 
    }

    unitTests: { input: string, expectedOutput: string }[],
}