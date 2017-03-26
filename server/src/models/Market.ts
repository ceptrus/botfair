import {IAvailable} from "./ERO";
import {IBetSide} from "./ETX";
import {Document} from "mongoose";
import {IRunnerType} from "./DailyStatistic";

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
    isFinished: boolean;
    state: {
        status: string;
        totalMatched: number;
    };
    stats?: {
        won: boolean;
        amount: number;
    };

    getWonOnDraw(): boolean;
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
    side: IBetSide | string;
    timeElapsed: number;
    runner: IRunnerType;
}

export interface IRunnerScore {
    name: string;
    score: string;
    halfTimeScore: string;
}

export interface IMongoMarket {
    marketId: string;
    date: string;
    markets: Array<IMarket>;
}

export interface IMongoMarketModel extends IMongoMarket, Document {}