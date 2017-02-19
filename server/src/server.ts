//<reference path="../typings/index.d.ts" />
//<reference path="../node_modules/@types/express/index.d.ts" />

import {BettingService} from "./BettingService";
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

new BettingService().init();

// const app = express();
//
// app.set('port', 3000);
// // app.set('port', (process.env.PORT || 3001));
//
// // Express only serves static assets in production
// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static('client/build'));
// // }
//
// app.get('/api/food', (req: Request, res: Response) => {
//     res.json({
//         "details": {
//             "amount": "14.05"
//         },
//         status: "SUCCESS",
//         walletName: "MAIN"
//     });
// });
//
// app.listen(app.get('port'), () => {
//     console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
// });