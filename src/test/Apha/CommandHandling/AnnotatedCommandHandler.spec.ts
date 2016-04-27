
import {expect} from "chai";
import {CommandHandler} from "../../../main/Apha/Decorators/CommandHandlerDecorator";
import {Command} from "../../../main/Apha/Message/Command";
import {AnnotatedCommandHandler} from "../../../main/Apha/CommandHandling/AnnotatedCommandHandler";

describe("AnnotatedCommandHandler", () => {
    describe("handle", () => {
        it("invokes correct handler", () => {
            let handler = new CommandHandlerDecoratorSpecCommandHandler1();
            let command = new CommandHandlerDecoratorSpecCommand1();

            handler.handle(command);

            expect(handler.handleSomethingCalled).to.equal(true);
        });

        it("invokes correct handlers", () => {
            let handler = new CommandHandlerDecoratorSpecCommandHandler1();
            let command = new CommandHandlerDecoratorSpecCommand2();

            handler.handle(command);

            expect(handler.handleSomethingElseCalled).to.equal(true);
        });
    });
});

class CommandHandlerDecoratorSpecCommand1 extends Command {}
class CommandHandlerDecoratorSpecCommand2 extends Command {}

class CommandHandlerDecoratorSpecCommandHandler1 extends AnnotatedCommandHandler {
    public handleSomethingCalled: boolean = false;
    public handleSomethingElseCalled: boolean = false;

    @CommandHandler
    public handleSomething(command: CommandHandlerDecoratorSpecCommand1): void {
        this.handleSomethingCalled = true;
    }

    @CommandHandler
    public handleSomethingElse(command: CommandHandlerDecoratorSpecCommand2): void {
        this.handleSomethingElseCalled = true;
    }
}

class CommandHandlerDecoratorSpecCommandHandler2 extends AnnotatedCommandHandler {
    public handleAnotherThingCalled: boolean = false;

    @CommandHandler
    public handleAnotherThing(command: CommandHandlerDecoratorSpecCommand1): void {
        this.handleAnotherThingCalled = true;
    }
}
