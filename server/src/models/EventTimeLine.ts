export interface IEventTimeLine {
    eventId: number;
    eventTypeId: number;
    score: {
        home: IEventTimeLineScore;
        away: IEventTimeLineScore;
        numberOfYellowCards: number;
        numberOfRedCards: number;
        numberOfCards: number;
        numberOfCorners: number;
        numberOfCornersFirstHalf: number;
        bookingPoints: number;
    };
    timeElapsed: number;
    elapsedRegularTime?: number;    // OPTIONAL
    elapsedAddedTime?: number;      // OPTIONAL
    updateDetails: Array<IEventTimeLineDetails>;
    status: EventTimeLineStatus;
    inPlayMatchStatus: EventTimeLineMatchStatus;
}

export interface IEventTimeLineScore {
    name: string;
    score: string;
    halfTimeScore: string;
    fullTimeScore: string;
    penaltiesScore: string;
    penaltiesSequence: Array<any>;
    games: string;
    sets: string;
    numberOfYellowCards: number;
    numberOfRedCards: number;
    numberOfCards: number;
    numberOfCorners: number;
    numberOfCornersFirstHalf: number;
    bookingPoints: number;
}

interface IEventTimeLineDetails {
    updateTime: string;
    updateId: number;
    matchTime: number;
    elapsedRegularTime: number;
    type: EventTimeLineMatchStatus;
    updateType: EventTimeLineMatchStatus;
}

export enum EventTimeLineStatus {
    IN_PLAY, COMPLETE
}

export enum EventTimeLineMatchStatus {
    KickOff, Finished
}

// {
//     "eventId": 28104386,
//     "eventTypeId": 1,
//     "score": {
//         "home": {
//             "name": "Tigres (Col)",
//             "score": "0",
//             "halfTimeScore": "",
//             "fullTimeScore": "",
//             "penaltiesScore": "",
//             "penaltiesSequence": [],
//             "games": "",
//             "sets": "",
//             "quarterByQuarter": [0, 0]
//         },
//         "away": {
//             "name": "Deportivo Pasto",
//             "score": "1",
//             "halfTimeScore": "",
//             "fullTimeScore": "",
//             "penaltiesScore": "",
//             "penaltiesSequence": [],
//             "games": "",
//             "sets": "",
//             "quarterByQuarter": [1, 0]
//         }
//     },
//     "timeElapsed": 47,
//     "updateDetails": [{
//         "updateTime": "1970-01-01T00:00:00.000Z",
//         "matchTime": 0,
//         "type": "KickOff",
//         "updateType": "KickOff"
//     }, {
//         "updateTime": "2017-02-14T22:04:42.018Z",
//         "team": "away",
//         "teamName": "Deportivo Pasto",
//         "player": "Y. Rivera",
//         "matchTime": 45,
//         "type": "Goal",
//         "updateType": "Goal"
//     }, {
//         "updateTime": "1970-01-01T00:00:00.000Z",
//         "matchTime": 0,
//         "type": "FirstHalfEnd",
//         "updateType": "FirstHalfEnd"
//     }, {"updateTime": "1970-01-01T00:00:00.000Z", "matchTime": 0, "type": "SecondHalfKickOff", "updateType": "SecondHalfKickOff"}],
//     "status": "IN_PLAY",
//     "inPlayMatchStatus": "SecondHalfKickOff"
// }

// {
//     "eventId": 28094702,
//     "eventTypeId": 1,
//     "score": {
//         "home": {
//             "name": "NK Solin",
//             "score": "2",
//             "halfTimeScore": "",
//             "fullTimeScore": "",
//             "penaltiesScore": "",
//             "penaltiesSequence": [],
//             "games": "",
//             "sets": "",
//             "numberOfYellowCards": 0,
//             "numberOfRedCards": 0,
//             "numberOfCards": 0,
//             "numberOfCorners": 3,
//             "numberOfCornersFirstHalf": 3,
//             "bookingPoints": 0
//         },
//         "away": {
//             "name": "NK Dugopolje",
//             "score": "0",
//             "halfTimeScore": "",
//             "fullTimeScore": "",
//             "penaltiesScore": "",
//             "penaltiesSequence": [],
//             "games": "",
//             "sets": "",
//             "numberOfYellowCards": 0,
//             "numberOfRedCards": 0,
//             "numberOfCards": 0,
//             "numberOfCorners": 5,
//             "numberOfCornersFirstHalf": 5,
//             "bookingPoints": 0
//         },
//         "numberOfYellowCards": 0,
//         "numberOfRedCards": 0,
//         "numberOfCards": 0,
//         "numberOfCorners": 8,
//         "numberOfCornersFirstHalf": 8,
//         "bookingPoints": 0
//     },
//     "timeElapsed": 53,
//     "elapsedRegularTime": 45,
//     "elapsedAddedTime": 8,
//     "updateDetails": [{
//         "updateTime": "2017-02-01T13:00:45.973Z",
//         "updateId": 7,
//         "matchTime": 1,
//         "elapsedRegularTime": 1,
//         "type": "KickOff",
//         "updateType": "KickOff"
//     }, {
//         "updateTime": "2017-02-01T13:15:12.131Z",
//         "updateId": 32,
//         "team": "home",
//         "teamName": "NK Solin",
//         "matchTime": 15,
//         "elapsedRegularTime": 15,
//         "type": "Goal",
//         "updateType": "Goal"
//     }, {
//         "updateTime": "2017-02-01T13:34:29.684Z",
//         "updateId": 64,
//         "team": "home",
//         "teamName": "NK Solin",
//         "matchTime": 34,
//         "elapsedRegularTime": 34,
//         "type": "Goal",
//         "updateType": "Goal"
//     }],
//     "status": "IN_PLAY",
//     "inPlayMatchStatus": "KickOff"
// }
