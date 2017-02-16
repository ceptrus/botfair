import {IBetSide} from "./ETX";

export interface ILBR {
    marketId: string;
    projectionStats: {
        MATCH: number;
        AVG_PRICE: number;
        PRICE: number;
    };
    matchProjection: string;
    selections: Array<IMarketSelection>;
}

interface IMarketSelection {
    selectionId: number;
    orders: Array<IMarketOrder>;
    matches: [{
        betId: string;
        matchId: string;
        price: number;
        size: number;
        matchDate: string;
        isBSP: boolean;
        side: IBetSide;
    }]
}

interface IMarketOrder {
    betId: string;
    marketId: string;
    selectionId: number;
    handicap: number;
    price: number;
    size: number;
    bspLiability: number;
    placedDate: string;
    matchedDate: string;
    averagePriceMatched: number;
    sizeMatched: number;
    sizeRemaining: number;
    sizeLapsed: number;
    sizeCancelled: number;
    sizeVoided: number;
    regulatorCode: string;
    side: IBetSide;
    status: string;
    persistenceType: string;
    orderType: string;
}


// [{
//     "marketId": "1.129422186",
//     "selections": [{
//         "selectionId": 7154519,
//         "orders": [{
//             "betId": "1:84635792744",
//             "marketId": "1.129422186",
//             "selectionId": 7154519,
//             "handicap": 0.0,
//             "price": 1.05,
//             "size": 2.0,
//             "bspLiability": 0.0,
//             "placedDate": "2017-02-01T13:44:19.000Z",
//             "matchedDate": "2017-02-01T13:44:24.000Z",
//             "averagePriceMatched": 1.05,
//             "sizeMatched": 2.0,
//             "sizeRemaining": 0.0,
//             "sizeLapsed": 0.0,
//             "sizeCancelled": 0.0,
//             "sizeVoided": 0.0,
//             "regulatorCode": "MALTA LOTTERIES AND GAMBLING AUTHORITY",
//             "side": "BACK",
//             "status": "EXECUTION_COMPLETE",
//             "persistenceType": "LAPSE",
//             "orderType": "LIMIT"
//         }, {
//             "betId": "1:84636395766",
//             "marketId": "1.129422186",
//             "selectionId": 7154519,
//             "handicap": 0.0,
//             "price": 2.0,
//             "size": 2.0,
//             "bspLiability": 0.0,
//             "placedDate": "2017-02-01T13:54:20.000Z",
//             "averagePriceMatched": 0.0,
//             "sizeMatched": 0.0,
//             "sizeRemaining": 2.0,
//             "sizeLapsed": 0.0,
//             "sizeCancelled": 0.0,
//             "sizeVoided": 0.0,
//             "regulatorCode": "MALTA LOTTERIES AND GAMBLING AUTHORITY",
//             "side": "BACK",
//             "status": "EXECUTABLE",
//             "persistenceType": "LAPSE",
//             "orderType": "LIMIT"
//         }],
//         "matches": [{
//             "betId": "1:84635792744",
//             "matchId": "98864574337",
//             "price": 1.05,
//             "size": 2.0,
//             "matchDate": "2017-02-01T13:44:24.000Z",
//             "isBSP": false,
//             "side": "BACK"
//         }]
//     }],
//     "projectionStats": {"MATCH": 1, "AVG_PRICE": 1, "PRICE": 1},
//     "matchProjection": "MATCH"
// }]
