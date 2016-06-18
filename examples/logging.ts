/// <reference path="./../typings/index.d.ts" />

import * as winston from "winston";
import {WinstonLogger} from "../src/main/Apha/Logging/WinstonLogger";
import {Logging} from "../src/main/Apha/Logging/Logger";

const levels = {};
levels[Logging.EMERGENCY] = Logging.Level.Emergency;
levels[Logging.ALERT] = Logging.Level.Alert;
levels[Logging.CRITICAL] = Logging.Level.Critical;
levels[Logging.ERROR] = Logging.Level.Error;
levels[Logging.WARNING] = Logging.Level.Warning;
levels[Logging.NOTICE] = Logging.Level.Notice;
levels[Logging.INFO] = Logging.Level.Info;
levels[Logging.DEBUG] = Logging.Level.Debug;

const winstonLogger = new winston.Logger({
    transports: [
        new winston.transports.Console()
    ]
});
winstonLogger.setLevels(levels);

const logger = new WinstonLogger(winstonLogger);
logger.emergency("foo bar");
