import {Document} from "mongoose";

export interface IWalletModel extends IWallet, Document {}

export interface IWallet {
    details: {
        amount: string;
    },
    status: string;
    walletName: string;
}

// [
//     {
//         "details": {
//             "amount": "12.00"
//         },
//         "status": "SUCCESS",
//         "walletName": "MAIN"
//     }
// ]
