import {Document} from "mongoose";

export interface IDailyStatisticDoc extends IDailyStatistic, Document {}

export interface IDailyStatistic {
    date: {                 // complex date to be able to do complex queries
        day: number;
        month: number;
        year: number;
    };
    win: {
        n: number;          // total wins this day
        profit: number;
        onDraw: number;     // total wins on draw
        onRunnerA: number;  // total wins on runner A
        onRunnerB: number;  // total wins on runner B
        markets: Array<string>;
    };
    lose: {
        n: number;          // total looses this day
        loss: number;
        onDraw: number;     // total looses on draw
        onRunnerA: number;  // total looses on runner A
        onRunnerB: number;  // total looses on runner B
        markets: Array<string>;
    };
    markets: Array<string>; // today markets
    marketChanges: Array<IDailyMarketChanges>;
}

export interface IDailyMarketChanges {
    marketId: string;
    bets: Array<IRunnerType>;
}

export enum IRunnerType {
    RunnerA,
    RunnerB,
    Draw
}