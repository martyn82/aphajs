
import {CommandGateway} from "./CommandGateway";
import {CommandBus} from "../CommandBus";
import {CommandDispatchInterceptor} from "../Interceptor/CommandDispatchInterceptor";
import {Command} from "../../Message/Command";

export class DefaultCommandGateway implements CommandGateway {
    constructor(private commandBus: CommandBus, private interceptors: CommandDispatchInterceptor[] = []) {}

    public send(command: Command): void {
        this.notifyBeforeDispatch(command);

        try {
            this.commandBus.send(command);
            this.notifyDispatchSuccessful(command);
        } catch (e) {
            this.notifyDispatchFailed(command, e);
        }
    }

    private notifyBeforeDispatch(command: Command): void {
        this.interceptors.forEach((interceptor) => {
            interceptor.onBeforeDispatch(command);
        });
    }

    private notifyDispatchSuccessful(command: Command): void {
        this.interceptors.forEach((interceptor) => {
            interceptor.onDispatchSuccessful(command);
        });
    }

    private notifyDispatchFailed(command: Command, error: Error): void {
        this.interceptors.forEach((interceptor) => {
            interceptor.onDispatchFailed(command, error);
        });
    }
}
