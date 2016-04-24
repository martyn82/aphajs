
import * as sinon from "sinon";
import {expect} from "chai";
import {TypedCommandHandler} from "../../../main/Apha/CommandHandling/TypedCommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {UnsupportedCommandException} from "../../../main/Apha/CommandHandling/UnsupportedCommandException";

describe("TypedCommandHandler", () => {
    let handler;
    let handlerMock;

    beforeEach(() => {
        handler = new TypedCommandHandlerSpecTypedCommandHandler();
        handlerMock = sinon.mock(handler);
    });

    describe("handle", () => {
        it("dispatches command to appropriate handler", () => {
            let command = new TypedCommandHandlerSpecCommand();
            handlerMock.expects("handleTypedCommandHandlerSpecCommand")
                .once()
                .withArgs(command);

            handler.handle(command);
        });

        it("throws exception if no appropriate handler can be found", () => {
            let command = new TypedCommandHandlerSpecCommand2();

            expect(() => {
                handler.handle(command);
            }).to.throw(UnsupportedCommandException);
        });
    });
});

class TypedCommandHandlerSpecTypedCommandHandler extends TypedCommandHandler {
    public handleTypedCommandHandlerSpecCommand(command: TypedCommandHandlerSpecCommand): void {
    }
}
class TypedCommandHandlerSpecCommand extends Command {}
class TypedCommandHandlerSpecCommand2 extends Command {}
