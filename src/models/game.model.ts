import { GameRound } from './gameRound.model';

export type Game = {
    hostId: string,
    players: string[],
    rounds: GameRound[],
    
    isStarted: boolean,
}