
import {Logging} from "./Logger";
import {AbstractLogger} from "./AbstractLogger";
import {LoggerInstance} from "winston";

export class WinstonLogger extends AbstractLogger {
    constructor(private logger: LoggerInstance) {
        super();
        logger.setLevels(this.levels);
    }

    private get levels(): Object {
        const levels = {};
        levels[Logging.EMERGENCY] = Logging.Level.Emergency;
        levels[Logging.ALERT] = Logging.Level.Alert;
        levels[Logging.CRITICAL] = Logging.Level.Critical;
        levels[Logging.ERROR] = Logging.Level.Error;
        levels[Logging.WARNING] = Logging.Level.Warning;
        levels[Logging.NOTICE] = Logging.Level.Notice;
        levels[Logging.INFO] = Logging.Level.Info;
        levels[Logging.DEBUG] = Logging.Level.Debug;
        return levels;
    }

    public log(level: Logging.Level, message: string, context?: Object): void {
        context = context ? context : {};
        this.logger.log(Logging.nameOf(level), message, context);
    }
}
