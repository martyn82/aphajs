
import * as sinon from "sinon";
import {DefaultCommandGateway} from "../../../../main/Apha/CommandHandling/Gateway/DefaultCommandGateway";
import {SimpleCommandBus} from "../../../../main/Apha/CommandHandling/SimpleCommandBus";
import {Command} from "../../../../main/Apha/Message/Command";
import {CommandDispatchInterceptor} from "../../../../main/Apha/CommandHandling/Interceptor/CommandDispatchInterceptor";

describe("DefaultCommandGateway", () => {
    let commandBus;
    let command;

    beforeEach(() => {
        commandBus = new SimpleCommandBus();
        command = new DefaultCommandGatewaySpecCommand();
    });

    describe("send", () => {
        it("sends a command to the command bus", () => {
            const commandBusMock = sinon.mock(commandBus);
            commandBusMock.expects("send")
                .once()
                .withArgs(command);

            const gateway = new DefaultCommandGateway(commandBus);
            gateway.send(command);

            commandBusMock.verify();
        });

        it("notifies interceptors before dispatch", () => {
            const interceptor = new DefaultCommandGatewaySpecCommandDispatchInterceptor();
            const interceptorMock = sinon.mock(interceptor);

            interceptorMock.expects("onBeforeDispatch")
                .once()
                .withArgs(command);

            const gateway = new DefaultCommandGateway(commandBus, [interceptor]);
            gateway.send(command);

            interceptorMock.verify();
        });

        it("notifies interceptors of successful dispatch", () => {
            const commandBusMock = sinon.mock(commandBus);

            commandBusMock.expects("send")
                .once()
                .withArgs(command);

            const interceptor = new DefaultCommandGatewaySpecCommandDispatchInterceptor();
            const interceptorMock = sinon.mock(interceptor);

            interceptorMock.expects("onDispatchSuccessful")
                .once()
                .withArgs(command);

            const gateway = new DefaultCommandGateway(commandBus, [interceptor]);
            gateway.send(command);

            interceptorMock.verify();
        });
    });
});

class DefaultCommandGatewaySpecCommand extends Command {}
class DefaultCommandGatewaySpecCommandDispatchInterceptor implements CommandDispatchInterceptor {
    public onBeforeDispatch(command: Command): void {}
    public onDispatchSuccessful(command: Command): void {}
    public onDispatchFailed(command: Command, error: Error): void {}
}
