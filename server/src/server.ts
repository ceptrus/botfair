require('dotenv').config({path: '.env'});

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

if (process.env.START_SERVER) {
    startServer();
}

function startServer() {
    const app = express();

    app.set('port', 3000);
    app.set('port', (process.env.PORT || 3000));

// Express only serves static assets in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

    app.get('/api/food', (req: Request, res: Response) => {
        res.json({
            "details": {
                "amount": "14.05"
            },
            status: "SUCCESS",
            walletName: "MAIN"
        });
    });

    app.listen(app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
    });
}