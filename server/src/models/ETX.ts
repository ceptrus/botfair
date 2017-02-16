export interface IETXPlaceBet {
    id: string;
    method: string;
    // params: any;
    params: Array<string | Array<ISelection> | any>;
    jsonrpc: string;
}

interface ISelection {
    selectionId: number;
    handicap: number;
    orderType: string;
    side: string;
    limitOrder: {
        size: number;
        price: number;
        persistenceType: string;
    };
}

export enum IBetSide {
    BACK, LAY
}

interface ETXData {
    id: string;
    jsonrpc: string;
    result: {
        customerRef: string;
        marketId: string;
        status: ETXStatus;
        instructionReports: {
            instruction: ISelection;
            betId: string;
            placeDate: string;
            averagePriceMatched: number;
            sizeMatched: number;
            status: ETXStatus;
            orderStatus: string;
        };
    }
}

export enum ETXStatus {
    SUCCESS, OTHER
}

// RETURNED DATA
// [{
//     "jsonrpc": "2.0",
//     "result": {
//         "customerRef": "1485956659302-1.129422186-plc-0",
//         "marketId": "1.129422186",
//         "instructionReports": [{
//             "instruction": {
//                 "selectionId": 7154519,
//                 "handicap": 0.0,
//                 "limitOrder": {"size": 2.0, "price": 1.05, "persistenceType": "LAPSE"},
//                 "orderType": "LIMIT",
//                 "side": "BACK"
//             },
//             "betId": "84635792744",
//             "placedDate": "2017-02-01T13:44:19.000Z",
//             "averagePriceMatched": 1.05,
//             "sizeMatched": 2.0,
//             "status": "SUCCESS",
//             "orderStatus": "EXECUTION_COMPLETE"
//         }],
//         "status": "SUCCESS"
//     },
//     "id": "1.129422186-plc"
// }]

// PLACE NEW BET
// [{
//     "method": "ExchangeTransactional/v1.0/place",
//     "params": [
//         "1.129422186",
//         [{
//             "selectionId": 7154519,
//             "handicap": 0,
//             "limitOrder": {"size": 2, "price": 1.05, "persistenceType": "LAPSE"},
//             "orderType": "LIMIT",
//             "side": "BACK"
//         }],
//         "1485956659302-1.129422186-plc-0"
//     ],
//     "id": "1.129422186-plc",
//     "jsonrpc": "2.0"
// }]