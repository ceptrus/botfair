import {IERO, MarketStatus, IMarketRunner, IAvailable} from "./models/ERO";
import {ILBR} from "./models/LBR";
// import _ from "lodash"
const _ = require("lodash");
import {IEventTimeLine} from "./models/EventTimeLine";
import {IETXPlaceBet} from "./models/ETX";
import {RequestHelper} from "./RequestHelper";

export class BettingRules {

    private minimumTotalMatch: number = 5000;
    private minAvailableMoneyToBet: number = 5;
    private backOverround: number = 107;
    private layOverround: number = 95;

    public filterMarkets(ero: IERO, lbr: Array<ILBR>, wallet: IWallet, eventTimeLine: Map<number, IEventTimeLine>): any {
        let marketsToBet: Array<Array<IETXPlaceBet>> = [];

        ero.eventTypes.forEach(eventType => {
            eventType.eventNodes.forEach(eventNode => {
                eventNode.marketNodes.forEach(market => {
                    let lbrMarket = this.getLBR(lbr, market.marketId);

                    let availableToBet: number = parseFloat(wallet.details.amount);
                    if (availableToBet <= 2.0) {
                        return true;
                    }

                    if (market.state.status === MarketStatus[MarketStatus.SUSPENDED]) {
                        return true;
                    }
                    if (market.state.totalMatched < this.minimumTotalMatch) {
                        return true;
                    }

                    let r1 = market.runners[0];
                    let r2 = market.runners[1];
                    let r3 = market.runners[2];

                    if (!this.hasMoney(r1) || !this.hasMoney(r2) || !this.hasMoney(r3)) {
                        return true;
                    }

                    let runnerToBet = this.selectRunnerToBet(r1, r2, r3);
                    if (!runnerToBet) {
                        return true;
                    }

                    let backOverround = this.getBackOverround(r1, r2, r3);
                    let layOverround = this.getLayOverround(r1, r2, r3);

                    console.log("back-lay overround" + backOverround + ' ' + layOverround);

                    if (backOverround > this.backOverround || layOverround < this.layOverround) {
                        return true;
                    }

                    /**
                     *              Already BET
                     */
                    if (lbrMarket.selections.length > 0) {
                        return true;
                    }

                    let timeline: IEventTimeLine = eventTimeLine.get(eventNode.eventId);
                    /**
                     *				BET ON DRAW
                     **/
                    let b1 = this.getBack(r1);
                    let b2 = this.getBack(r2);
                    let b3 = this.getBack(r3);

                    // if (timeline.elapsedRegularTime < 30) {
                    if (timeline.timeElapsed < 80) {
                        return true;
                    }
// {"eventId":28104386,"eventTypeId":1,"score":{"home":{"name":"Tigres (Col)","score":"0","halfTimeScore":"","fullTimeScore":"","penaltiesScore":"","penaltiesSequence":[],"games":"","sets":"","quarterByQuarter":[0,0]},"away":{"name":"Deportivo Pasto","score":"1","halfTimeScore":"","fullTimeScore":"","penaltiesScore":"","penaltiesSequence":[],"games":"","sets":"","quarterByQuarter":[1,0]}},"timeElapsed":47,"updateDetails":[{"updateTime":"1970-01-01T00:00:00.000Z","matchTime":0,"type":"KickOff","updateType":"KickOff"},{"updateTime":"2017-02-14T22:04:42.018Z","team":"away","teamName":"Deportivo Pasto","player":"Y. Rivera","matchTime":45,"type":"Goal","updateType":"Goal"},{"updateTime":"1970-01-01T00:00:00.000Z","matchTime":0,"type":"FirstHalfEnd","updateType":"FirstHalfEnd"},{"updateTime":"1970-01-01T00:00:00.000Z","matchTime":0,"type":"SecondHalfKickOff","updateType":"SecondHalfKickOff"}],"status":"IN_PLAY","inPlayMatchStatus":"SecondHalfKickOff"}
                    // bet on draw
                    if (runnerToBet === r3) {
                        let deltaR1 = b3.price - b1.price;
                        let deltaR2 = b3.price - b2.price;

                        if (deltaR1 < 0 && deltaR2 < 0 && Math.abs(deltaR1) > 2 && Math.abs(deltaR2) > 2) {
                            console.log("BET ON DRAW");
                            wallet.details.amount = (availableToBet - 2).toString();
                            let m: Array<IETXPlaceBet> = RequestHelper.getETXPlaceBetQuery(market.marketId, r3.selectionId, r3.exchange.availableToBack[0]);
                            marketsToBet.push(m);
                            return true;
                        }
                    }

                    /**
                     * BET IN NORMAL CONDITIONS
                     */
                    let rToBetPrice = runnerToBet.exchange.availableToBack[0].price;
                    if (Math.abs(b1.price - b2.price) > 8 && b3.price - rToBetPrice > 3) {
                        console.log("BET IN NORMAL CONDITIONS");
                        wallet.details.amount = (availableToBet - 2).toString();
                        let m: Array<IETXPlaceBet> = RequestHelper.getETXPlaceBetQuery(market.marketId, runnerToBet.selectionId, runnerToBet.exchange.availableToBack[0]);
                        marketsToBet.push(m);
                        return true;
                    }

                    /**
                     * FINISH FOR NOW
                     */

                })
            })
        });
        return marketsToBet;
    }

    private getBackOverround(r1: IMarketRunner, r2: IMarketRunner, r3: IMarketRunner): number {
        return (1 / this.getBack(r1).price + 1 / this.getBack(r2).price + 1 / this.getBack(r3).price) * 100;
    };

    private getLayOverround = function (r1: IMarketRunner, r2: IMarketRunner, r3: IMarketRunner): number {
        return (1 / this.getLay(r1).price + 1 / this.getLay(r2).price + 1 / this.getLay(r3).price) * 100;
    };

    private getBack(r: IMarketRunner): IAvailable {
        return r.exchange.availableToBack[0];
    }

    private getLay(r: IMarketRunner): IAvailable {
        return r.exchange.availableToLay[0];
    }

    /**
     * Select the runner who have the lower Odd
     */
    private selectRunnerToBet(r1: IMarketRunner, r2: IMarketRunner, r3: IMarketRunner): IMarketRunner {
        if (!r3.exchange.availableToBack || !r2.exchange.availableToBack || !r1.exchange.availableToBack) {
            console.log("Isto esta foda pk nunca devia ter passado aqui");
            return null;
        }

        // THE DRAW IS WINNING
        if (r3.exchange.availableToBack[0].price < r1.exchange.availableToBack[0].price &&
            r3.exchange.availableToBack[0].price < r2.exchange.availableToBack[0].price) {
            return r3;
        }

        if (r1.exchange.availableToBack[0].price < r2.exchange.availableToBack[0].price) {
            return r1;
        }
        return r2;
    };

    private getLBR(lbrList: Array<ILBR>, marketId: string): ILBR {
        return _.find(lbrList, (lbr: ILBR) => lbr.marketId === marketId);
    }

    private hasMoney(runner: IMarketRunner): boolean {
        if (runner && runner.exchange && runner.exchange.availableToBack && runner.exchange.availableToBack.length > 0
            && runner.exchange.availableToLay && runner.exchange.availableToLay.length > 0) {
            if (runner.exchange.availableToBack[0].size >= this.minAvailableMoneyToBet) {
                return true;
            }
        }
        return false;
    }
}