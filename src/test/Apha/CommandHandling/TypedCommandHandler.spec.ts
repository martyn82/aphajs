
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {TypedCommandHandler} from "../../../main/Apha/CommandHandling/TypedCommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {UnsupportedCommandException} from "../../../main/Apha/CommandHandling/UnsupportedCommandException";

chai.use(chaiAsPromised);

describe("TypedCommandHandler", () => {
    let handler;
    let handlerMock;

    beforeEach(() => {
        handler = new TypedCommandHandlerSpecTypedCommandHandler();
        handlerMock = sinon.mock(handler);
    });

    describe("handle", () => {
        it("dispatches command to appropriate handler", (done) => {
            const command = new TypedCommandHandlerSpecCommand();
            handlerMock.expects("handleTypedCommandHandlerSpecCommand")
                .once()
                .withArgs(command);

            handler.handle(command).then(() => {
                handlerMock.verify();
                done();
            });
        });

        it("throws exception if no appropriate handler can be found", (done) => {
            const command = new TypedCommandHandlerSpecCommand2();

            expect(handler.handle(command)).to.be.rejectedWith(UnsupportedCommandException).and.notify(done);
        });
    });
});

class TypedCommandHandlerSpecTypedCommandHandler extends TypedCommandHandler {
    public handleTypedCommandHandlerSpecCommand(command: TypedCommandHandlerSpecCommand): void {
    }
}
class TypedCommandHandlerSpecCommand extends Command {}
class TypedCommandHandlerSpecCommand2 extends Command {}
