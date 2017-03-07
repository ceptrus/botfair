export interface IERO {
    currencyCode: string;
    indicative: boolean;
    eventTypes: Array<IEventType>;
}

interface IEventType {
    eventTypeId: number;
    eventNodes: Array<IEventNode>;
}

interface IEventNode {
    eventId: number;
    marketNodes: Array<IMarketNode>;
}

export interface IMarketNode {
    marketId: string;
    isMarketDataDelayed: boolean;
    highWaterMark: string;
    isMarketDataVirtual: boolean;
    state: IMarketState;
    runners: Array<IMarketRunner>;
}

interface IMarketState {
    betDelay: number;
    bspReconciled: boolean;
    complete: boolean;
    inplay: boolean;
    numberOfWinners: number;
    numberOfRunners: number;
    numberOfActiveRunners: number;
    lastMatchTime: string;
    totalMatched: number;
    totalAvailable: number;
    crossMatching: boolean;
    runnersVoidable: boolean;
    version: number;
    status: string;
}

export enum MarketStatus {
    OPEN, CLOSED, SUSPENDED
}

export interface IMarketRunner {
    selectionId: number;
    handicap: number;
    description: {
        runnerName: string;
    };
    state: {
        sortPriority: number;
        lastPriceTraded: number;
        totalMatched: number;
        status: RunnerStatus;
    };
    exchange: {
        availableToBack: [IAvailable];
        availableToLay: [IAvailable]
    }
}

export interface IAvailable {
    price: number;
    size: number;
}

export enum RunnerStatus {
    ACTIVE
}

// {
//     "currencyCode": "EUR",
//     "eventTypes": [{
//         "eventTypeId": 1,
//         "eventNodes": [{
//             "eventId": 28094702,
//             "marketNodes": [{
//                 "marketId": "1.129422186",
//                 "isMarketDataDelayed": false,
//                 "highWaterMark": "3800473945",
//                 "state": {
//                     "betDelay": 5,
//                     "bspReconciled": false,
//                     "complete": true,
//                     "inplay": true,
//                     "numberOfWinners": 1,
//                     "numberOfRunners": 3,
//                     "numberOfActiveRunners": 3,
//                     "lastMatchTime": "2017-02-01T13:44:24.415Z",
//                     "totalMatched": 3082.782755183974,
//                     "totalAvailable": 6250.035791738107,
//                     "crossMatching": true,
//                     "runnersVoidable": false,
//                     "version": 1546566720,
//                     "status": "OPEN"
//                 },
//                 "runners": [{
//                     "selectionId": 7154519,
//                     "handicap": 0.0,
//                     "description": {"runnerName": "NK Solin"},
//                     "state": {
//                         "sortPriority": 1,
//                         "lastPriceTraded": 1.05,
//                         "totalMatched": 2906.9172961483455,
//                         "status": "ACTIVE"
//                     },
//                     "exchange": {
//                         "availableToBack": [
//                             {"price": 1.05, "size": 380.33464356435644},
//                             {"price": 1.04, "size": 515.8},
//                             {"price": 1.03, "size": 1085.8460611650569}],
//                         "availableToLay": [
//                             {"price": 1.06, "size": 10.630532277227724},
//                             {"price": 1.07, "size": 64.44},
//                             {"price": 1.08, "size": 37.07247524752475
//                         }]
//                     }
//                 }, {
//                     "selectionId": 7154508,
//                     "handicap": 0.0,
//                     "description": {"runnerName": "NK Dugopolje"},
//                     "state": {"sortPriority": 2, "lastPriceTraded": 36.0, "totalMatched": 44.43192048954252, "status": "ACTIVE"},
//                     "exchange": {
//                         "availableToBack": [{"price": 25.0, "size": 5.246408713997123}, {
//                             "price": 24.0,
//                             "size": 2.0
//                         }, {"price": 23.0, "size": 20.0}],
//                         "availableToLay": [{"price": 120.0, "size": 2.39}, {"price": 150.0, "size": 2.0}, {
//                             "price": 220.0,
//                             "size": 3.0000000000000004
//                         }]
//                     }
//                 }, {
//                     "selectionId": 58805,
//                     "handicap": 0.0,
//                     "description": {"runnerName": "The Draw"},
//                     "state": {"sortPriority": 3, "lastPriceTraded": 34.0, "totalMatched": 131.43353854608628, "status": "ACTIVE"},
//                     "exchange": {
//                         "availableToBack": [{"price": 17.5, "size": 4.503463924978787}, {
//                             "price": 15.0,
//                             "size": 2.6692182178217845
//                         }, {"price": 13.0, "size": 6.526830276313787}], "availableToLay": [{"price": 48.0, "size": 4.120000000000001}]
//                     }
//                 }],
//                 "isMarketDataVirtual": true
//             }]
//         }]
//     }],
//     "indicative": false
// }