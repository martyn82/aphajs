
import {Logger, Logging} from "./Logger";

export abstract class AbstractLogger implements Logger {
    public emergency(message: string, context?: Object): void {
        this.log(Logging.Level.Emergency, message, context);
    }

    public alert(message: string, context?: Object): void {
        this.log(Logging.Level.Alert, message, context);
    }

    public critical(message: string, context?: Object): void {
        this.log(Logging.Level.Critical, message, context);
    }

    public error(message: string, context?: Object): void {
        this.log(Logging.Level.Error, message, context);
    }

    public warning(message: string, context?: Object): void {
        this.log(Logging.Level.Warning, message, context);
    }

    public notice(message: string, context?: Object): void {
        this.log(Logging.Level.Notice, message, context);
    }

    public info(message: string, context?: Object): void {
        this.log(Logging.Level.Info, message, context);
    }

    public debug(message: string, context?: Object): void {
        this.log(Logging.Level.Debug, message, context);
    }

    public abstract log(level: Logging.Level, message: string, context?: Object): void;
}
