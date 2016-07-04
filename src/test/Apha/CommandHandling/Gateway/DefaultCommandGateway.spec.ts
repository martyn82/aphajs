
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {DefaultCommandGateway} from "../../../../main/Apha/CommandHandling/Gateway/DefaultCommandGateway";
import {SimpleCommandBus} from "../../../../main/Apha/CommandHandling/SimpleCommandBus";
import {Command} from "../../../../main/Apha/Message/Command";
import {CommandDispatchInterceptor} from "../../../../main/Apha/CommandHandling/Interceptor/CommandDispatchInterceptor";

chai.use(chaiAsPromised);

describe("DefaultCommandGateway", () => {
    let commandBus;
    let command;

    beforeEach(() => {
        commandBus = new SimpleCommandBus();
        command = new DefaultCommandGatewaySpecCommand();
    });

    describe("send", () => {
        it("sends a command to the command bus", (done) => {
            const commandBusMock = sinon.mock(commandBus);
            commandBusMock.expects("send")
                .once()
                .withArgs(command)
                .returns(new Promise<void>(resolve => resolve()));

            const gateway = new DefaultCommandGateway(commandBus);

            expect(gateway.send(command)).to.eventually.be.fulfilled.and.satisfy(() => {
                commandBusMock.verify();
                return true;
            }).and.notify(done);
        });

        it("notifies interceptors before dispatch", (done) => {
            const interceptor = new DefaultCommandGatewaySpecCommandDispatchInterceptor();
            const interceptorMock = sinon.mock(interceptor);

            interceptorMock.expects("onBeforeDispatch")
                .once()
                .withArgs(command);

            const gateway = new DefaultCommandGateway(commandBus, [interceptor]);
            expect(gateway.send(command)).to.eventually.be.fulfilled.and.satisfy(() => {
                interceptorMock.verify();
                return true;
            }).and.notify(done);
        });

        it("notifies interceptors of successful dispatch", (done) => {
            const commandBusMock = sinon.mock(commandBus);

            commandBusMock.expects("send")
                .once()
                .withArgs(command)
                .returns(new Promise<void>(resolve => resolve()));

            const interceptor = new DefaultCommandGatewaySpecCommandDispatchInterceptor();
            const interceptorMock = sinon.mock(interceptor);

            interceptorMock.expects("onDispatchSuccessful")
                .once()
                .withArgs(command);

            const gateway = new DefaultCommandGateway(commandBus, [interceptor]);
            expect(gateway.send(command)).to.eventually.be.fulfilled.and.satisfy(() => {
                interceptorMock.verify();
                return true;
            }).and.notify(done);
        });
    });
});

class DefaultCommandGatewaySpecCommand extends Command {}
class DefaultCommandGatewaySpecCommandDispatchInterceptor implements CommandDispatchInterceptor {
    public onBeforeDispatch(command: Command): void {}
    public onDispatchSuccessful(command: Command): void {}
    public onDispatchFailed(command: Command, error: Error): void {}
}
