
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {SimpleCommandBus} from "../../../main/Apha/CommandHandling/SimpleCommandBus";
import {CommandHandler} from "../../../main/Apha/CommandHandling/CommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {NoCommandHandlerException} from "../../../main/Apha/CommandHandling/NoCommandHandlerException";
import {CommandHandlerAlreadyExistsException} from "../../../main/Apha/CommandHandling/CommandHandlerAlreadyExistsException";

chai.use(chaiAsPromised);

describe("SimpleCommandBus", () => {
    let commandBus;

    beforeEach(() => {
        commandBus = new SimpleCommandBus();
    });

    describe("handle", () => {
        it("handles command by registered handler", (done) => {
            const command = new SimpleCommandBusCommand();
            const handler = new SimpleCommandBusCommandHandler();

            const handlerMock = sinon.mock(handler);
            handlerMock.expects("handle").once().withArgs(command);

            commandBus.registerHandler(SimpleCommandBusCommand, handler);
            commandBus.send(command).then(() => {
                handlerMock.verify();
                done();
            });
        });

        it("throws exception if command cannot be handled", (done) => {
            const command = new SimpleCommandBusCommand();
            expect(commandBus.send(command)).to.be.rejectedWith(NoCommandHandlerException).and.notify(done);
        });
    });

    describe("registerHandler", () => {
        it("throws exception if a handler is already registered for a command type", () => {
            const handler1 = new SimpleCommandBusCommandHandler();
            const handler2 = new SimpleCommandBusCommandHandler();

            commandBus.registerHandler(SimpleCommandBusCommand, handler1);

            expect(() => {
                commandBus.registerHandler(SimpleCommandBusCommand, handler2);
            }).to.throw(CommandHandlerAlreadyExistsException);
        });
    });

    describe("unregisterHandler", () => {
        it("unregisters a handler by command type", (done) => {
            const command = new SimpleCommandBusCommand();
            const handler = new SimpleCommandBusCommandHandler();

            const handlerMock = sinon.mock(handler);
            handlerMock.expects("handle").never();

            commandBus.registerHandler(SimpleCommandBusCommand, handler);
            commandBus.unregisterHandler(SimpleCommandBusCommand);

            expect(commandBus.send(command)).to.be.rejectedWith(NoCommandHandlerException).and.notify(() => {
                handlerMock.verify();
                done();
            });
        });

        it("is idempotent", () => {
            expect(() => {
                commandBus.unregisterHandler(SimpleCommandBusCommand);
            }).not.to.throw(Error);
        });
    });
});

class SimpleCommandBusCommand extends Command {}
class SimpleCommandBusCommandHandler implements CommandHandler {
    public async handle(command: Command): Promise<void> {}
}
