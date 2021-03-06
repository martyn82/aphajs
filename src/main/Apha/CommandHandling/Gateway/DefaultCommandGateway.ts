
import {CommandGateway} from "./CommandGateway";
import {CommandBus} from "../CommandBus";
import {CommandDispatchInterceptor} from "../Interceptor/CommandDispatchInterceptor";
import {Command} from "../../Message/Command";

export class DefaultCommandGateway implements CommandGateway {
    constructor(private commandBus: CommandBus, private interceptors: CommandDispatchInterceptor[] = []) {}

    public async send(command: Command): Promise<void> {
        this.notifyBeforeDispatch(command);

        return this.commandBus.send(command).then(
            () => this.notifyDispatchSuccessful(command),
            e => this.notifyDispatchFailed(command, e)
        );
    }

    private notifyBeforeDispatch(command: Command): void {
        this.interceptors.forEach(interceptor => {
            interceptor.onBeforeDispatch(command);
        });
    }

    private notifyDispatchSuccessful(command: Command): void {
        this.interceptors.forEach(interceptor => {
            interceptor.onDispatchSuccessful(command);
        });
    }

    private notifyDispatchFailed(command: Command, error: Error): void {
        this.interceptors.forEach(interceptor => {
            interceptor.onDispatchFailed(command, error);
        });
    }
}
