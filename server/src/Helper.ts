import {IFacetedQuery, IProductType, IFacetedQuerySelectBy, CurrencyCode} from "./models/Faceted";
import {IETXPlaceBet, IBetSide} from "./models/ETX";
import {IERO, IMarketNode, IMarketRunner} from "./models/ERO";
import {ILBR, IMarketSelection} from "./models/LBR";
import {IEventTimeLine, IEventTimeLineScore} from "./models/EventTimeLine";
import {IMergedData, IRunnerInfo, IRunnerScore, IBetInfo} from "./models/MergedObject";
import * as _ from "lodash";
let moment = require("moment");

enum IRunnerEnum {
    RunnerA,
    RunnerB,
    RunnerDraw
}

export class Helper {

    public static mergeDataObjects(ero: IERO, lbrs: Array<ILBR>, timelines: Map<number, IEventTimeLine>): Array<IMergedData> {
        let markets: Array<IMergedData> = [];
        
        ero.eventTypes.forEach(eventType => {
            eventType.eventNodes.forEach(eventNode => {
                eventNode.marketNodes.forEach((market: IMarketNode) => {
                    let lbrMarket = this.getLBRMarket(lbrs, market.marketId);
                    let timeLine: IEventTimeLine = timelines.get(eventNode.eventId);

                    let timeElapsed: number = timeLine.timeElapsed ? timeLine.timeElapsed : null;

                    let mergedData: IMergedData = {
                        marketId: market.marketId,
                        eventTypeId: eventType.eventTypeId,
                        timeElapsed: timeElapsed,
                        competitionId: 1,
                        state: {
                            status: market.state.status,
                            totalMatched: market.state.totalMatched,
                        },
                        eventId: eventNode.eventId,
                        date: Date.now(),
                        runnerA: this.getRunnerData(IRunnerEnum.RunnerA, market, timeLine),
                        runnerB: this.getRunnerData(IRunnerEnum.RunnerB, market, timeLine),
                        runnerDraw: this.getRunnerData(IRunnerEnum.RunnerDraw, market, timeLine),
                        bets: this.getBets(lbrMarket),
                    };

                    markets.push(mergedData);
                });
            });
        });
        
        return markets;
    }

    private static getRunnerData(runnerIndex: IRunnerEnum, marketNode: IMarketNode, timeLine: IEventTimeLine): IRunnerInfo {
        let runner: IMarketRunner = marketNode.runners[runnerIndex];

        let score: IRunnerScore = null;
        if (runnerIndex === 0) {
            score = this.getScore(timeLine.score.home);
        } else if (runnerIndex === 1) {
            score = this.getScore(timeLine.score.away);
        }

        return {
            availableToBack: _.cloneDeep(runner.exchange.availableToBack),
            availableToLay: _.cloneDeep(runner.exchange.availableToLay),
            runnerName: runner.description.runnerName,
            selectionId: runner.selectionId,
            score: score
        };
    }

    private static getBets(lbrMarket: ILBR): Array<IBetInfo> {
        let bets: Array<IBetInfo> = [];

        _.forEach(lbrMarket.selections, (selection: IMarketSelection) => {
            _.forEach(selection.matches, match => {
                let bet: IBetInfo = {
                    selectionId: selection.selectionId,
                    betId: match.betId,
                    placedDate: match.matchDate,
                    price: match.price,
                    size: match.size,
                    side: match.side
                };
                bets.push(bet);
            });
        });
        return bets;
    }

    private static getScore(score: IEventTimeLineScore): IRunnerScore {
        return {
            halfTimeScore: score.halfTimeScore,
            name: score.name,
            score: score.score
        }
    }

    private static getLBRMarket(lbrList: Array<ILBR>, marketId: string): ILBR {
        return _.find(lbrList, (lbr: ILBR) => lbr.marketId === marketId);
    }

    public static getETXPlaceBetQuery(marketId: string, selectionId: number, size: number): Array<IETXPlaceBet> {
        return [{
            id: marketId + "-plc",
            jsonrpc: "2.0",
            params: [
                marketId,
                [{
                    selectionId: selectionId,
                    handicap: 0,
                    orderType: "LIMIT",
                    side: IBetSide[IBetSide.BACK],
                    limitOrder: {
                        size: size,
                        price: 1.01, //
                        // price: price.price.toFixed(2),
                        persistenceType: "LAPSE"
                    }
                }],
                moment().millisecond() + "-" + marketId + "-plc-0"
            ],
            method: "ExchangeTransactional/v1.0/place"
        }]
    }

    public static getFacetedQuery(): IFacetedQuery {
        return {
            facets: null,
            filter: {
                eventTypeIds: [1],
                productTypes: [IProductType[IProductType.EXCHANGE]],
                contentGroup: {
                    language: "en",
                    regionCode: "UK"
                },
                marketTypeCodes: ["MATCH_ODDS"],
                // marketIds: ["1.129574316"],
                inPlayOnly: true,
                attachments: ["MARKET_LITE"],
                maxResults: 40,
                selectBy: IFacetedQuerySelectBy[IFacetedQuerySelectBy.FIRST_TO_START]
            },
            currencyCode: CurrencyCode[CurrencyCode.EUR],
            locale: "en_GB"
        };
    }

}