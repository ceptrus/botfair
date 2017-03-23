import {IMarket, IBetInfo, IRunnerInfo, IMongoMarket} from "./models/Market";
import * as NodeCache from "node-cache";
import {Request} from "./Request";
import {CronJob} from "cron";
import {MongoService} from "./mongo/MongoService";
import IPromise = Axios.IPromise;
import {IEventTimeLine} from "./models/EventTimeLine";
import {IDailyStatistic, IDailyStatisticDoc, IRunnerType, IDailyMarketChanges} from "./models/DailyStatistic";
import {DailyStatisticModel, DailyStatistic} from "./mongo/MongoSchemas";
import {IWallet} from "./models/Wallet";
let moment = require("moment");

interface IDate {
    day: number;
    month: number;
    year: number;
}

export class StatisticsService {
    private cache: NodeCache;
    private walletJobExpression: string = "0 0 5 1/1 * *";
    private request: Request;
    private mongoService: MongoService;

    private todayStatsDoc: IDailyStatisticDoc = null;
    private busy: boolean = false;

    private DailyStatisticModel: DailyStatisticModel = DailyStatistic;

    constructor(request: Request) {
        this.request = request;
        this.mongoService = new MongoService();

        const today = this.getDate();
        this.mongoService.getDailyStatistic(today.day, today.month, today.year)
            .then((doc: IDailyStatisticDoc) => {
                this.todayStatsDoc = doc;
                if (doc === null) {
                    this.createDailyStatistics();
                }
            });

        // Get wallet job
        new CronJob(this.walletJobExpression, this.getWallet, null, true);

        this.initCache();
    }

    private initCache(): void {
        this.cache = new NodeCache({
            checkperiod: 120,
            stdTTL: 60,
        });
        this.cache.on("expired", this.processElementExpired.bind(this));
    }

    public saveMarketStatistics(markets: Array<IMarket>): Array<IMarket> {

        markets.forEach(market => {
            // this.processElementExpired(market.marketId, market);
            this.cache.set(market.marketId, market);
        });

        return markets;
    }

    private updateDailyStatistics(promisedValues: any) {
        let dailyStatistic: IDailyStatistic = this.todayStatsDoc;
        let mongoMarket: IMongoMarket = promisedValues[0];
        let market: IMarket = mongoMarket.markets[mongoMarket.markets.length - 1];
        let timeLine: IEventTimeLine = promisedValues[1];

        let runnerWinner: IRunnerType = this.getWinnerRunner(timeLine);
        let winner: IBetInfo = this.getWinner(runnerWinner, market.bets);
        let originalBet = market.bets[0] ? market.bets[0] : null;

        this.updateAndSaveMarketStats(market, timeLine);

        dailyStatistic.markets.push(market.marketId);
        if (market.distinctBets === 1) {
            dailyStatistic.win.n++;
            dailyStatistic.markets.push(market.marketId);
            dailyStatistic.win.onDraw += runnerWinner === IRunnerType.Draw ? 1 : 0;
            dailyStatistic.win.onRunnerA += runnerWinner === IRunnerType.RunnerA ? 1 : 0;
            dailyStatistic.win.onRunnerB += runnerWinner === IRunnerType.RunnerB ? 1 : 0;
            let profit: string = (originalBet.price * originalBet.size - originalBet.size).toFixed(2);
            dailyStatistic.win.profit += Number(profit);

        } else if (market.distinctBets >= 1) {
            dailyStatistic.lose.n++;
            dailyStatistic.markets.push(market.marketId);
            dailyStatistic.lose.onDraw = originalBet.runner === IRunnerType.Draw ? 1 : 0;
            dailyStatistic.lose.onRunnerA = originalBet.runner === IRunnerType.RunnerA ? 1 : 0;
            dailyStatistic.lose.onRunnerB = originalBet.runner === IRunnerType.RunnerB ? 1 : 0;

            let won: string = market.bets.filter((bet: IBetInfo) => bet.selectionId === winner.selectionId)
                .map((bet: IBetInfo) => bet.size * bet.price - bet.size)
                .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
                .toFixed(2);
            dailyStatistic.win.profit += Number(won);

            let lost: string = market.bets.filter((bet: IBetInfo) => bet.selectionId !== winner.selectionId)
                .map((bet: IBetInfo) => bet.size)
                .reduce((previousValue: number, currentValue: number) => previousValue + currentValue)
                .toFixed(2);
            dailyStatistic.lose.loss += Number(lost);
        }

        let marketChanges: IDailyMarketChanges = {
            marketId: market.marketId,
            bets: [],
        };
        market.bets.forEach((bet: IBetInfo) => {
            marketChanges.bets.push(bet.runner);
        });
        dailyStatistic.marketChanges.push(marketChanges);

        this.todayStatsDoc = <IDailyStatisticDoc>dailyStatistic;
        return this.DailyStatisticModel.findByIdAndUpdate(this.todayStatsDoc._id, dailyStatistic);
    }

    private createDailyStatistics(): Promise<any> {
        let today: IDate = this.getDate();
        if (this.todayStatsDoc === null || (this.busy === false && this.todayStatsDoc.date.day !== today.day)) {
            this.busy = true;

            let todayStats: IDailyStatistic = {
                date: {
                    day: today.day,
                    month: today.month,
                    year: today.year
                },
                win: {
                    n: 0,
                    onDraw: 0,
                    onRunnerA: 0,
                    onRunnerB: 0,
                    profit: 0,
                    markets: [],
                },
                lose: {
                    n: 0,
                    onDraw: 0,
                    onRunnerA: 0,
                    onRunnerB: 0,
                    loss: 0,
                    markets: [],
                },
                marketChanges: [],
                markets: [],
            };

            return this.DailyStatisticModel.findOneAndUpdate({
                "date.day": todayStats.date.day,
                "date.month": todayStats.date.month,
                "date.year": todayStats.date.year,
            }, todayStats, {upsert: true, new: true}).then((doc: any) => {
                this.todayStatsDoc = doc;
                this.busy = false;
            });
        }
        return Promise.resolve();
    }

    private processElementExpired(marketId: string, market: IMarket) {
        let mongoMarketPromise: Promise<IMongoMarket> = this.mongoService.getMarket(marketId);
        let timeLinePromise: IPromise<any> = this.request.getTimeLine(market.eventId);

        return Promise.all([mongoMarketPromise, timeLinePromise, this.createDailyStatistics()])
            .then(this.updateDailyStatistics.bind(this))
            .catch((e) => console.error("StatisticService: " + e));
    }

    private getDate(): IDate {
        let today = moment();
        let day: number = today.date();
        let month: number = today.month() + 1;
        let year: number = today.year();

        return {day: day, month: month, year: year};
    }

    public saveBalance(wallet: IWallet): void {
        // since this is running after the end of the day, at 3:00,
        // the date we should use is from yesterday
        let yesterday = moment();

        this.mongoService.saveWallet({
            balance: wallet.details.amount,
            date: {
                day: yesterday.date(),
                month: yesterday.month() + 1,
                year: yesterday.year(),
            }
        });
    }

    private getWallet(): void {
        this.request.getWallet()
            .then(this.saveBalance.bind(this))
    }

    private getWinnerRunner(timeLine: IEventTimeLine): IRunnerType {
        if (timeLine.score.home.score === timeLine.score.away.score) {
            return IRunnerType.Draw;
        } else if (timeLine.score.home.score > timeLine.score.away.score) {
            return IRunnerType.RunnerA;
        }
        return IRunnerType.RunnerB;
    }

    private getWinner(runnerWinner: IRunnerType, bets: Array<IBetInfo>): IBetInfo {
        return bets.find((bet: IBetInfo) => bet.runner === runnerWinner);
    }

    private updateAndSaveMarketStats(market: IMarket, timeLine: IEventTimeLine): void {

    }
}