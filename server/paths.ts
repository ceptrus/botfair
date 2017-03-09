let moment = require("moment");

export class paths {
    public static urlLogin: string = "https://identitysso.betfair.com/api/login";
    public static urlKeepAlive: string = "https://identitysso.betfair.com/api/keepAlive";
    public static urlFacet: string = "https://www.betfair.com/www/sports/navigation/facet/v1/search";
    public static urlLBR: string = "https://www.betfair.com/www/sports/exchange/reporting/live/v1.0/getMarketPositionViews?alt=json&includeSettledProfit=false&marketIds={marketIds}&matchProjection=MATCH&ts={timestamp}";
    public static urlERO: string = "https://www.betfair.com/www/sports/exchange/readonly/v1/bymarket?currencyCode=EUR&locale=en_GB&marketIds={marketIds}&rollupLimit=2&rollupModel=STAKE&types=MARKET_STATE,RUNNER_STATE,RUNNER_EXCHANGE_PRICES_BEST,RUNNER_DESCRIPTION&ts={timestamp}";
    public static urlETX: string = "https://www.betfair.com/api/etx-json-rpc?alt=json";
    public static urlCashout: string = "";
    public static urlWallet: string = "https://www.betfair.com/wallet-service/v3.0/wallets?walletNames=[MAIN]&alt=json";
    public static urlTimeline: string = "https://www.betfair.com/inplayservice/v1/eventTimeline?alt=json&eventId={eventId}&locale=en_GB&productType=EXCHANGE&regionCode=UK&ts={timestamp}";

    public static getTimeLine(eventId: number): string {
        return paths.urlTimeline.replace("{eventId}", eventId.toString()).replace("{timestamp}", moment().milliseconds().toString());
    }

    public static getERO(marketIds: Array<string>): string {
        let markets = marketIds.join(",");
        return paths.urlERO.replace("{marketIds}", markets).replace("{timestamp}", moment().millisecond().toString());
    }

    public static getLBR(marketIds: Array<string>): string {
        let markets = marketIds.join(",");
        return paths.urlLBR.replace("{marketIds}", markets).replace("{timestamp}", moment().millisecond().toString());
    }
}
