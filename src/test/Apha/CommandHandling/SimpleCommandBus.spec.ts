
import * as sinon from "sinon";
import {expect} from "chai";
import {SimpleCommandBus} from "../../../main/Apha/CommandHandling/SimpleCommandBus";
import {CommandHandler} from "../../../main/Apha/CommandHandling/CommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {NoCommandHandlerException} from "../../../main/Apha/CommandHandling/NoCommandHandlerException";
import {CommandHandlerAlreadyExistsException} from "../../../main/Apha/CommandHandling/CommandHandlerAlreadyExistsException";

describe("SimpleCommandBus", () => {
    let commandBus;

    beforeEach(() => {
        commandBus = new SimpleCommandBus();
    });

    describe("handle", () => {
        it("handles command by registered handler", () => {
            let command = new SimpleCommandBusCommand();
            let handler = new SimpleCommandBusCommandHandler();

            let handlerMock = sinon.mock(handler);
            handlerMock.expects("handle").once().withArgs(command);

            commandBus.registerHandler(SimpleCommandBusCommand, handler);
            commandBus.send(command);

            handlerMock.verify();
        });

        it("throws exception if command cannot be handled", () => {
            let command = new SimpleCommandBusCommand();

            expect(() => {
                commandBus.send(command);
            }).to.throw(NoCommandHandlerException);
        });
    });

    describe("registerHandler", () => {
        it("throws exception if a handler is already registered for a command type", () => {
            let handler1 = new SimpleCommandBusCommandHandler();
            let handler2 = new SimpleCommandBusCommandHandler();

            commandBus.registerHandler(SimpleCommandBusCommand, handler1);

            expect(() => {
                commandBus.registerHandler(SimpleCommandBusCommand, handler2);
            }).to.throw(CommandHandlerAlreadyExistsException);
        });
    });

    describe("unregisterHandler", () => {
        it("unregisters a handler by command type", () => {
            let command = new SimpleCommandBusCommand();
            let handler = new SimpleCommandBusCommandHandler();

            let handlerMock = sinon.mock(handler);
            handlerMock.expects("handle").never();

            commandBus.registerHandler(SimpleCommandBusCommand, handler);
            commandBus.unregisterHandler(SimpleCommandBusCommand);

            expect(() => {
                commandBus.send(command);
            }).to.throw(NoCommandHandlerException);

            handlerMock.verify();
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
    public handle(command: Command): void {}
}
