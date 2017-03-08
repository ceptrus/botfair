import {IAvailable} from "./ERO";
import {IBetSide} from "./ETX";

export interface IMarket {
    marketId: string;
    eventId: number;
    eventTypeId: number;
    competitionId: number;
    cashedOut: boolean;
    runnerA: IRunnerInfo;
    runnerB: IRunnerInfo;
    runnerDraw: IRunnerInfo;
    bets: Array<IBetInfo>;
    distinctBets: number;
    timeElapsed: number;
    state: {
        status: string;
        totalMatched: number;
    }
}

export interface IRunnerInfo {
    selectionId: number;
    runnerName: string;
    availableToBack: [IAvailable];
    availableToLay: [IAvailable];
    score?: IRunnerScore;
}

export interface IBetInfo {
    selectionId: number;
    betId: string;
    price: number;
    size: number;
    side: IBetSide;
    placedDate: string;
}

export interface IRunnerScore {
    name: string;
    score: string;
    halfTimeScore: string;
}

export interface IMongoMarket {
    marketId: string;
    date: number;
    markets: Array<IMarket>;
}