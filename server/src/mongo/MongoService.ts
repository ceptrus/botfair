import {Model, Document} from "mongoose";
import {IMarket, IMongoMarket, IMongoMarketModel} from "../models/Market";
import {WalletModel, MongoMarket, MongoMarketModel, DailyStatisticModel, DailyStatistic} from "./MongoSchemas";
import {IDailyStatisticDoc} from "../models/DailyStatistic";
let moment = require("moment");

export class MongoService {
    private MongoMarketModel: MongoMarketModel = MongoMarket;
    private WalletModel: Model<Document> = WalletModel;
    private DailyStatisticModel: DailyStatisticModel = DailyStatistic;

    public constructor() {
        require('mongoose').Promise = global.Promise;
    }

    public getMarket(marketId: string): Promise<IMongoMarket> {
        return this.MongoMarketModel.findOne({marketId: marketId}).exec();
    }

    public getDailyStatistic(day: number, month: number, year: number): Promise<IDailyStatisticDoc> {
        return this.DailyStatisticModel.findOne({"date.day": day, "date.month": month, "date.year": year}).exec();
    }

    public saveWallet(data: any): Promise<Document> {
        return new this.WalletModel(data).save();
    }

    public saveMarket(markets: Array<IMarket>) {

        markets.filter((market: IMarket) => !market.isFinished)
            .forEach((market: IMarket) => {
            this.MongoMarketModel.findOne({marketId: market.marketId})
                .then((savedMarket: IMongoMarketModel) => this.createMarket(market, savedMarket))
                .then((savedMarket: IMongoMarketModel) => this.updateMarket(market, savedMarket))
                .catch(error => console.error("MongoService: " + error));
        });

        return markets;
    }

    private createMarket(market: IMarket, savedMarket: IMongoMarketModel): Promise<IMongoMarketModel> {
        if (savedMarket === null) {
            let today: string = moment().format("DD-MM-YYYY");

            let mm: IMongoMarket = {
                marketId: market.marketId,
                date: today,
                markets: [],
            };

            savedMarket = new this.MongoMarketModel(mm);
            return savedMarket.save();
        }
        return Promise.resolve(savedMarket);
    }

    private updateMarket(market: IMarket, savedMarket: IMongoMarketModel): any {
        // Check to not save this market in the end of the match when ETX is not returning bets anymore
        // but the market is still not CLOSED
        if (savedMarket.markets.length > 0 && savedMarket.markets[savedMarket.markets.length - 1].bets.length > market.bets.length) {
            return;
        }
        return savedMarket.update({$push: {markets: market}});
    }

}

