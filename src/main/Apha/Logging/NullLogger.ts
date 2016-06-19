
import {Logging} from "./Logger";
import {AbstractLogger} from "./AbstractLogger";

export class NullLogger extends AbstractLogger {
    public log(level: Logging.Level, message: string, context?: Object): void {
        // no-op
    }
}
