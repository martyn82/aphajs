
import {Logging} from "./Logger";
import {AbstractLogger} from "./AbstractLogger";
import {LoggerInstance} from "winston";

export class WinstonLogger extends AbstractLogger {
    constructor(private logger: LoggerInstance) {
        super();
    }

    public log(level: Logging.Level, message: string, context: Object = {}): void {
        this.logger.log(Logging.nameOf(level), message, context);
    }
}
