import {MarketStatus, IAvailable} from "./models/ERO";
import {IETXPlaceBet} from "./models/ETX";
import {Helper} from "./Helper";
import {IMergedData, IRunnerInfo} from "./models/MergedObject";

export class BettingRules {

    private minimumTotalMatch: number = 5000;
    private backOverRound: number = 107;
    private layOverRound: number = 95;

    private BET_SIZE: number = 4;

    public filterMarkets(markets: Array<IMergedData>, wallet: IWallet): any {
        let marketsToBet: Array<Array<IETXPlaceBet>> = [];
        let marketsWithBets: number = 0;

        markets.forEach((market: IMergedData) => {
            marketsWithBets += market.distinctBets;

            let availableToBet: number = parseFloat(wallet.details.amount);
            if (availableToBet <= 3.0) {
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

            let backOverRound = this.getBackOverround(r1, r2, r3);
            let layOverRound = this.getLayOverround(r1, r2, r3);

            if (backOverRound > this.backOverRound || layOverRound < this.layOverRound) {
                return true;
            }

            /**
             *              Already BET
             */
            if (market.distinctBets >= 2) {
                return true;
            }

            if (market.distinctBets > 0 && market.distinctBets === 1) {
                let matchedSelection = market.bets[0];

                if (matchedSelection.selectionId !== runnerToBet.selectionId) {
                    let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, runnerToBet.selectionId, this.BET_SIZE);
                    marketsToBet.push(m);
                    console.log("Counter bet " + market.marketId);
                }

                return true;
            }

            if (!market.timeElapsed) {
                return true;
            }

            /**
             *                BET ON DRAW
             **/
            let b1 = this.getBack(r1);
            let b2 = this.getBack(r2);
            let b3 = this.getBack(r3);

            // if (timeline.timeElapsed < 65) {
            //     return true;
            // }

            // bet on draw
            if (runnerToBet === r3) {
                let deltaR1 = b3.price - b1.price;
                let deltaR2 = b3.price - b2.price;

                if ((market.timeElapsed > 60 && deltaR1 < 0 && deltaR2 < 0 && Math.abs(deltaR1) > 15 && Math.abs(deltaR2) > 15) ||
                    (market.timeElapsed > 80 && deltaR1 < 0 && deltaR2 < 0 && Math.abs(deltaR1) > 10 && Math.abs(deltaR2) > 10)) {

                    console.log("BET ON DRAW");

                    wallet.details.amount = (availableToBet - 2).toString();
                    let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, r3.selectionId, this.BET_SIZE);
                    marketsToBet.push(m);
                    return true;
                }
            }

            /**
             * BET IN NORMAL CONDITIONS
             */
            let rToBetPrice = runnerToBet.availableToBack[0].price;
            if (market.timeElapsed > 45 && Math.abs(b1.price - b2.price) > 14 && b3.price - rToBetPrice > 7) {
                console.log("BET IN NORMAL CONDITIONS");

                wallet.details.amount = (availableToBet - 2).toString();
                let m: Array<IETXPlaceBet> = Helper.getETXPlaceBetQuery(market.marketId, runnerToBet.selectionId, this.BET_SIZE);
                marketsToBet.push(m);
                return true;
            }

            /**
             * FINISH FOR NOW
             */

        });

        if (marketsWithBets > 0) {
            console.log("You have " + marketsWithBets + " active bets");
        }
        return marketsToBet;
    }

    private getBackOverround(r1: IRunnerInfo, r2: IRunnerInfo, r3: IRunnerInfo): number {
        return (1 / this.getBack(r1).price + 1 / this.getBack(r2).price + 1 / this.getBack(r3).price) * 100;
    };

    private getLayOverround = function (r1: IRunnerInfo, r2: IRunnerInfo, r3: IRunnerInfo): number {
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
