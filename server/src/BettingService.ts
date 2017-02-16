import {CronJob} from "cron";
import {LoginService} from "./LoginService";
import {Request} from "./Request";
import {paths} from "../paths";
import {IFacetedQuery} from "./models/Faceted";
import {RequestHelper} from "./RequestHelper";
import IPromise = Axios.IPromise;
import {IERO} from "./models/ERO";
import {ILBR} from "./models/LBR";
import {BettingRules} from "./BettingRules";
import {IEventTimeLine} from "./models/EventTimeLine";
import {IETXPlaceBet} from "./models/ETX";

export class BettingService {
    private loginService: LoginService;
    private cron: CronJob;
    // private cronExpression: string = "1,10,20,30,40,50 * * * * *";
    // private cronExpression: string = "*/5 * * * * *";
    private cronExpression: string = "*/30 * * * * *";

    constructor() {
        console.log("BettingService started!");
    }

    public init(): void {
        this.loginService = new LoginService();

        this.loginService.startAuthentication().then(() => {
            this.cron = new CronJob(this.cronExpression, this.work.bind(this), null, true);
            // this.work();
        }).catch((error: string) => {
            console.error(error);
        });
    }

    private work(): void {
        try {
            let request = Request.getInstance();
            let facetedQuery: IFacetedQuery = RequestHelper.getFacetedQuery();

            Promise.resolve()
                .then(() => request.post(paths.urlFacet, facetedQuery))
                .then(this.extractFacetedIds)
                .then(this.requestMarketData)
                .then(this.getEventTimeline)
                .then(this.mergeAllData)
                .then(this.filterWithBettingRules)
                .then(this.bet)
                .then((d) => console.log(d))
                .catch(error => console.log(error));
        } catch (error) {
            console.log("merda");
            console.error(JSON.stringify(error));
        }
    }

    private bet(bets: Array<Array<IETXPlaceBet>>): string {
        let request = Request.getInstance();

        bets.forEach(bet => {
            console.log(JSON.stringify(bet));
            request.post(paths.urlETX, bet);
        });
        return "done";
    }

    private filterWithBettingRules(data: any): any {
        let bettingRules: BettingRules = new BettingRules();
        return bettingRules.filterMarkets(data.ero, data.lbr, data.wallet, data.eventTimeLine);
    }

    private mergeAllData(values: Array<any>): any {
        let ero: IERO = values[0];
        let lbr: Array<ILBR> = values[1];
        let wallet: IWallet = values[2];
        let eventTimeLine: Map<number, IEventTimeLine> = new Map<number, IEventTimeLine>();

        for (let i = 3; i < values.length; i++) {
            let e: IEventTimeLine = values[i].data;
            eventTimeLine.set(e.eventId, e);
        }

        return {
            ero: ero,
            lbr: lbr,
            wallet: wallet,
            eventTimeLine: eventTimeLine
        }
    }

    private getEventTimeline(values: Array<any>): any {
        let ero: IERO = values[0].data;
        let lbr: Array<ILBR> = values[1].data;
        let wallet: IWallet = values[2].data[0];
        let request = Request.getInstance();

        let eventTimeline: Array<IPromise<any>> = [];
        eventTimeline.push(Promise.resolve(ero), Promise.resolve(lbr), Promise.resolve(wallet));

        ero.eventTypes.forEach(eventType => {
            eventType.eventNodes.forEach(event => {
                eventTimeline.push(request.get(paths.getTimeLine(event.eventId)));
            })
        });

        return Promise.all(eventTimeline);
    }

    private requestMarketData(markets: Array<any>): Promise<Array<any>> {
        let request = Request.getInstance();

        console.log("Found " + markets.length + " inplay markets");

        let ero: IPromise<any> = request.get(paths.getERO(markets));
        let lbr: IPromise<any> = request.get(paths.getLBR(markets));
        let wallet: IPromise<any> = request.get(paths.urlWallet);

        return Promise.all([ero, lbr, wallet]);
    }

    private extractFacetedIds(facetedData: any): Array<string> {
        return facetedData.data.results.map((market: any) => market.marketId);
    }

}