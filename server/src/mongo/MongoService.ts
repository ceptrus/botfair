import {Model, Document} from "mongoose";
import {IMarket, IMongoMarket, IMongoMarketModel} from "../models/Market";
import {WalletModel, MongoMarket, MongoMarketModel} from "./MongoSchemas";
let moment = require("moment");

export class MongoService {
    private MongoMarketModel: MongoMarketModel = MongoMarket;
    private WalletModel: Model<Document> = WalletModel;

    public constructor() {
        require('mongoose').Promise = global.Promise;
    }

    public getMarket(marketId: string): Promise<IMongoMarket> {
        return this.MongoMarketModel.findOne({marketId: marketId}).exec();
    }

    // public getDailyStatistic(day: number, month: number, year: number): Promise<IDailyStatisticDoc> {
    //     return this.DailyStatisticModel.findOne({"date.day": day, "date.month": month, "date.year": year}).exec();
    // }

    public saveWallet(data: any): Promise<Document> {
        return new this.WalletModel(data).save();
    }

    public saveMarket(markets: Array<IMarket>) {

        markets.forEach((market: IMarket) => {
            this.MongoMarketModel.findOne({marketId: market.marketId})
                .then((savedMarket: IMongoMarketModel) => this.createMarket(market, savedMarket))
                .then((savedMarket: IMongoMarketModel) => this.updateMarket(market, savedMarket))
                .catch(error => console.error(error));
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
        return savedMarket.update({$push: {markets: market}});
    }

}

