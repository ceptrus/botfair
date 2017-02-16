import {IFacetedQuery, IProductType, IFacetedQuerySelectBy, CurrencyCode} from "./models/Faceted";
import {IETXPlaceBet, IBetSide} from "./models/ETX";
import {IAvailable} from "./models/ERO";
const moment = require("moment");

export class RequestHelper {

    public static getETXPlaceBetQuery(marketId: string, selectionId: number, price: IAvailable): Array<IETXPlaceBet> {
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
                        size: 2,
                        price: price.price.toFixed(2),
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
                // marketIds: ["1.129672060"],
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