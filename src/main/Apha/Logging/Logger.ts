
export namespace Logging {
    export const EMERGENCY = "emergency";
    export const ALERT = "alert";
    export const CRITICAL = "critical";
    export const ERROR = "error";
    export const WARNING = "warning";
    export const NOTICE = "notice";
    export const INFO = "info";
    export const DEBUG = "debug";

    export enum Level {
        None = -1,
        Emergency,
        Alert,
        Critical,
        Error,
        Warning,
        Notice,
        Info,
        Debug
    }

    export function nameOf(level: Level): string {
        switch (level) {
            case Level.Emergency:
                return EMERGENCY;

            case Level.Alert:
                return ALERT;

            case Level.Critical:
                return CRITICAL;

            case Level.Error:
                return ERROR;

            case Level.Warning:
                return WARNING;

            case Level.Notice:
                return NOTICE;

            case Level.Info:
                return INFO;

            case Level.Debug:
                return DEBUG;
        }

        return "none";
    }
}

export interface Logger {
    /**
     * System unusable.
     */
    emergency(message: string, context?: Object): void;

    /**
     * Action must be taken immediately.
     */
    alert(message: string, context?: Object): void;

    /**
     * Critical conditions.
     * Examples: Application component unavailable, unexpected exception.
     */
    critical(message: string, context?: Object): void;

    /**
     * Runtime errors that do not require immediate action but should typically be logged and monitored.
     */
    error(message: string, context?: Object): void;

    /**
     * Exceptional occurrences that are not errors.
     * Examples: Use of deprecated APIs, poor use of API, undesirable things that are not necessarily wrong.
     */
    warning(message: string, context?: Object): void;

    /**
     * Normal but significant events.
     */
    notice(message: string, context?: Object): void;

    /**
     * Interesting events.
     * Examples: User logs in, SQL logs.
     */
    info(message: string, context?: Object): void;

    /**
     * Detailed debug information.
     */
    debug(message: string, context?: Object): void;

    /**
     * Arbitrary logs.
     */
    log(level: Logging.Level, message: string, context?: Object): void;
}
