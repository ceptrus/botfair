import {Schema, createConnection} from "mongoose";
import {Model} from "mongoose";
import {Document} from "mongoose";
import {IDailyStatisticDoc} from "../models/DailyStatistic";
import {IMongoMarketModel} from "../models/Market";

require('mongoose').Promise = global.Promise;
export const mongooseConnection = createConnection(process.env.MONGODB_URI);

/**
 * Market Schema definition
 */
const MongoMarketSchema: Schema = new Schema({
    marketId: {
        type: String,
        required: true,
        index: {unique: true},
    },
    date: {
        type: String,
        index: true,
    },
    markets: Schema.Types.Mixed,
});

/**
 * Wallet Schema definition
 */
const WalletSchema: Schema = new Schema({
    date: {type: Schema.Types.Mixed, required: true, index: {unique: true}},
    balance: {type: Number, required: true}
});

/**
 * Daily Statistics Schema definition
 */
const DailyStatisticSchema: Schema = new Schema({
    date: {type: Schema.Types.Mixed, required: true, index: {unique: true}},
    win: {type: Schema.Types.Mixed, required: true},
    lose: {type: Schema.Types.Mixed, required: true},
    markets: {type: Schema.Types.Mixed, required: true},
    marketChanges: {type: Schema.Types.Mixed, required: true}
});

// export const WalletDateSchema: Schema = new Schema({
//     day: {type: Number, required: true, index: true},
//     month: {type: Number, required: true, index: true},
//     year: {type: Number, required: true, index: true},
// });

export type MongoMarketModel = Model<IMongoMarketModel>;
export type DailyStatisticModel = Model<IDailyStatisticDoc>;
export const MongoMarket: MongoMarketModel = <MongoMarketModel>mongooseConnection.model<IMongoMarketModel>("Market", MongoMarketSchema);
export const WalletModel: Model<Document> = mongooseConnection.model("Balance", WalletSchema);
export const DailyStatistic: DailyStatisticModel = mongooseConnection.model<IDailyStatisticDoc>("DailyStatistics", DailyStatisticSchema);