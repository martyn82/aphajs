/// <reference path="./../typings/index.d.ts" />

import * as winston from "winston";
import {WinstonLogger} from "../src/main/Apha/Logging/WinstonLogger";

const winstonLogger = new winston.Logger({
    transports: [
        new winston.transports.Console()
    ]
});

const logger = new WinstonLogger(winstonLogger);
logger.emergency("foo bar");
