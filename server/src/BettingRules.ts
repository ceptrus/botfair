import {MarketStatus, IAvailable} from "./models/ERO";
import {IETXPlaceBet} from "./models/ETX";
import {Helper} from "./Helper";
import {IMarket, IRunnerInfo} from "./models/Market";
import {IWallet} from "./models/Wallet";
import {Request} from "./Request";

export class BettingRules {

    private minimumTotalMatch: number = 8000;
    private backOverRound: number = 107;
    private layOverRound: number = 95;

    private BET_SIZE: number = 3.5;

    public filterMarkets(markets: Array<IMarket>, wallet: IWallet): Array<Array<IETXPlaceBet>> {
        let marketsToBet: Array<Array<IETXPlaceBet>> = [];
        let marketsWithBets: number = 0;
        let availableToBet: number = parseFloat(wallet.details.amount);

        markets.forEach((market: IMarket) => {
            marketsWithBets += market.distinctBets;

            if (availableToBet < this.BET_SIZE) {
                return true;
            }

            if (market.state.status === MarketStatus[MarketStatus.SUSPENDED]) {
                return true;
            }

            if (market.state.totalMatched < this.minimumTotalMatch) {
                return true;
            }

            let r1 = market.runnerA;
            let r2 = market.runnerB;
            let r3 = market.runnerDraw;

            if (!this.hasMoney(r1) || !this.hasMoney(r2) || !this.hasMoney(r3)) {
                return true;
            }

            let runnerToBet = this.selectRunnerToBet(r1, r2, r3);
            if (!runnerToBet) {
                return true;
            }

            let backOverRound = this.getBackOverRound(r1, r2, r3);
            let layOverRound = this.getLayOverRound(r1, r2, r3);

            if (backOverRound > this.backOverRound || layOverRound < this.layOverRound) {
                return true;
            }

            /**
             * Already BET
             */
            if (market.distinctBets >= 2) {
                return true;
            }

            /**
             * SHOULD CASHOUT HERE
             * market.cashedOut = true;
             */

            if (market.distinctBets > 0 && market.distinctBets === 1) {
                let matchedSelection = market.bets[0];

                if (matchedSelection.selectionId !== runnerToBet.selectionId) {
                    /**
                     * When this happens I should read the odds and if it greater than 1.5 I should bet on draw
                     * otherwise I should cashout if possible
                     */
                    Request.getInstance().doCashout(100, market.marketId);
                    console.log("CashedOut: " + market.marketId);
                    // wallet.details.amount = (availableToBet - this.BET_SIZE).toString();
                    // let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, runnerToBet.selectionId, this.BET_SIZE);
                    // marketsToBet.push(m);
                    // console.log("Counter bet " + market.marketId);
                }
                return true;
            }

            if (!market.timeElapsed) {
                return true;
            }

            /**
             * BET ON DRAW
             **/
            let b1 = this.getBack(r1);
            let b2 = this.getBack(r2);
            let b3 = this.getBack(r3);

            // bet on draw
            if (runnerToBet === r3) {
                let deltaR1 = b3.price - b1.price;
                let deltaR2 = b3.price - b2.price;

                if ((market.timeElapsed > 60 && deltaR1 < 0 && deltaR2 < 0 && Math.abs(deltaR1) > 15 && Math.abs(deltaR2) > 15) ||
                    (market.timeElapsed > 80 && deltaR1 < 0 && deltaR2 < 0 && Math.abs(deltaR1) > 10 && Math.abs(deltaR2) > 10)) {

                    console.log("BET ON DRAW");

                    wallet.details.amount = (availableToBet - this.BET_SIZE).toString();
                    let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, r3.selectionId, this.BET_SIZE);
                    marketsToBet.push(m);
                    return true;
                }
            }

            /**
             * BET IN NORMAL CONDITIONS
             */
            let rToBetPrice = runnerToBet.availableToBack[0].price;
            if (market.timeElapsed > 48 && Math.abs(b1.price - b2.price) > 13 && b3.price - rToBetPrice > 7) {
                console.log("BET IN NORMAL CONDITIONS");

                wallet.details.amount = (availableToBet - this.BET_SIZE).toString();
                let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, runnerToBet.selectionId, this.BET_SIZE);
                marketsToBet.push(m);
                return true;
            }

            /**
             * SAVE DATA
             */



            /**
             * FINISH FOR NOW
             */
        });

        console.log("Cash: " + wallet.details.amount + " (" +
            (Number(wallet.details.amount) + marketsWithBets * this.BET_SIZE).toFixed(2) + ")");

        console.log("You have " + marketsWithBets + " active bets");
        return marketsToBet;
    }

    private getBackOverRound(r1: IRunnerInfo, r2: IRunnerInfo, r3: IRunnerInfo): number {
        return (1 / this.getBack(r1).price + 1 / this.getBack(r2).price + 1 / this.getBack(r3).price) * 100;
    };

    private getLayOverRound = function (r1: IRunnerInfo, r2: IRunnerInfo, r3: IRunnerInfo): number {
        return (1 / this.getLay(r1).price + 1 / this.getLay(r2).price + 1 / this.getLay(r3).price) * 100;
    };

    private getBack(r: IRunnerInfo): IAvailable {
        return r.availableToBack[0];
    }

    private getLay(r: IRunnerInfo): IAvailable {
        return r.availableToLay[0];
    }

    /**
     * Select the runner who have the lower Odd
     */
    private selectRunnerToBet(r1: IRunnerInfo, r2: IRunnerInfo, r3: IRunnerInfo): IRunnerInfo {
        if (!r3.availableToBack || !r2.availableToBack || !r1.availableToBack) {
            console.log("Isto esta foda pk nunca devia ter passado aqui");
            return null;
        }

        // THE DRAW IS WINNING
        if (r3.availableToBack[0].price < r1.availableToBack[0].price &&
            r3.availableToBack[0].price < r2.availableToBack[0].price) {
            return r3;
        }

        if (r1.availableToBack[0].price < r2.availableToBack[0].price) {
            return r1;
        }
        return r2;
    };

    private hasMoney(runner: IRunnerInfo): boolean {
        if (runner && runner.availableToBack && runner.availableToBack.length > 0
            && runner.availableToLay && runner.availableToLay.length > 0) {
            // if (runner.exchange.availableToBack[0].size >= this.minAvailableMoneyToBet) {
            return true;
            // }
        }
        return false;
    }
}
