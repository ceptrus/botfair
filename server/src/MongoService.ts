import * as mongoose from "mongoose";
import {IMarket} from "./models/Market";
import {Schema} from "mongoose";
import {Model} from "mongoose";
import {Document} from "mongoose";
let moment = require("moment");

export class MongoService {
    private MarketModel: Model<Document>;

    public constructor() {
        require('mongoose').Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI);

        this.MarketModel = mongoose.model("Market", this.MongoMarketSchema);
    }

    private MongoMarketSchema: Schema = new Schema({
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

    public saveMarket(markets: Array<IMarket>) {

        markets.forEach((market: IMarket) => {
            this.MarketModel.findOne({marketId: market.marketId})
                .then((savedMarket: any) => this.createMarket(market, savedMarket))
                .then((savedMarket: any) => this.updateMarket(market, savedMarket))
                .catch(error => console.error(error));
        });

        return markets;
    }

    private createMarket(market: IMarket, savedMarket: any): any {
        if (savedMarket === null) {
            let today: string = moment().format("DD-MM-YYYY");

            savedMarket = new this.MarketModel({
                marketId: market.marketId,
                date: today,
                markets: [],
            });
            return savedMarket.save();
        }
        return Promise.resolve(savedMarket);
    }

    private updateMarket(market: IMarket, savedMarket: any): void {
        return savedMarket.update({$push: {markets: market}});
    }

}

