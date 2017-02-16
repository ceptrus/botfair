export interface IFacetedQuery {
    locale: string;
    currencyCode: string;
    facets: [{
        type: string;
        maxValues: number;
        skipValues: number;
        applyNextTo: number;
    }]
    filter: IFacetedQueryFilter;
}

interface IFacetedQueryFilter {
    eventTypeIds?: Array<number>;
    productTypes: Array<string>;
    contentGroup: {
        language: string;
        regionCode: string;
    };
    eventIds?: Array<string>;
    attachments?: Array<string>;
    marketTypeCodes?: Array<string>;
    marketIds?: Array<string>;
    inPlayOnly?: boolean;
    maxResults: number;
    selectBy?: string;
}

export enum FacetType {
    EVENT, MARKET, EVENT_TYPE
}

export enum IProductType {
    EXCHANGE,
    SPORTS
}

export enum IFacetedQuerySelectBy {
    FIRST_TO_START,
    RANK
}

export enum CurrencyCode {
    EUR
}

export interface IFacetedResponse {
    facets: [{
        values: [{
            key: {
                eventId: number;
            };
            cardinality: number;
        }];
        totalResults: number;
        type: FacetType;
    }];
    results: Array<any>;
    attachments: {
        events: Map<string, FacetedEventAttachment>;
    }
}

interface FacetedEventAttachment {
    eventId: string;
    key: string;
    name: string;
    eventTypeId: number;
    timezone: string;
    openDate: string;
    videoAvailable: boolean;
}

// FACETED RESPONSE
// {
//     "facets": [{
//         "values": [{
//             "key": {
//                 "eventId": 28094702
//             },
//             "cardinality": 20
//         }],
//         "totalResults": 1,
//         "type": "EVENT"
//     }],
//     "results": [],
//     "attachments": {
//         "events": {
//             "28094702": {
//                 "eventId": 28094702,
//                 "key": "EVENT:28094702",
//                 "name": "NK Solin v NK Dugopolje",
//                 "eventTypeId": 1,
//                 "timezone": "Europe/London",
//                 "openDate": "2017-02-01T13:00:00.000Z",
//                 "videoAvailable": false
//             }
//         }
//     }
// }

// FACETED QUERY
// {
//     "filter": {
//         "eventTypeIds": [1],
//         "productTypes": ["EXCHANGE"],
//         "selectBy": "RANK",
//         "contentGroup": {"language": "en", "regionCode": "UK"},
//         "maxResults": 0,
//         "inPlayOnly": true,
//         "eventIds": [28094702]
//     },
//     "facets": [{
//         "type": "EVENT",
//         "maxValues": 0, "skipValues": 0,
//         "applyNextTo": 0
//     }],
//     "currencyCode": "EUR",
//     "locale": "en_GB"
// }