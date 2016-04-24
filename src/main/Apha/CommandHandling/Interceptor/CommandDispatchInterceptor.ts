
import {Command} from "../../Message/Command";

export interface CommandDispatchInterceptor {
    onBeforeDispatch(command: Command): void;
    onDispatchSuccessful(command: Command): void;
    onDispatchFailed(command: Command, error: Error): void;
}
