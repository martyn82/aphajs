
import {expect} from "chai";
import {CommandHandler} from "../../../main/Apha/CommandHandling/CommandHandlerDecorator";
import {Command, CommandType} from "../../../main/Apha/Message/Command";
import {AnnotatedCommandHandler} from "../../../main/Apha/CommandHandling/AnnotatedCommandHandler";
import {Mixin} from "../../../main/MixinDecorator";

describe("AnnotatedCommandHandler", () => {
    describe("handle", () => {
        it("invokes correct handler", () => {
            const handler = new CommandHandlerDecoratorSpecCommandHandler1();
            const command = new CommandHandlerDecoratorSpecCommand1();

            handler.handle(command);

            expect(handler.handleSomethingCalled).to.equal(true);
        });

        it("invokes correct handlers", () => {
            const handler = new CommandHandlerDecoratorSpecCommandHandler1();
            const command = new CommandHandlerDecoratorSpecCommand2();

            handler.handle(command);

            expect(handler.handleSomethingElseCalled).to.equal(true);
        });
    });

    describe("getSupportedCommands", () => {
        it("should return the supported commands", () => {
            const handler = new CommandHandlerDecoratorSpecCommandHandler1();

            const commands = new Set<CommandType>();
            commands.add(CommandHandlerDecoratorSpecCommand1);
            commands.add(CommandHandlerDecoratorSpecCommand2);

            expect(handler.getSupportedCommands()).to.eql(commands);
        });

        it("should return the supported commands for mixed-in class", () => {
            const handler = new CommandHandlerDecoratorSpecMixedInCommandHandler();

            const commands = new Set<CommandType>();
            commands.add(CommandHandlerDecoratorSpecCommand1);

            expect(handler.getSupportedCommands()).to.eql(commands);
        });
    });
});

class CommandHandlerDecoratorSpecCommand1 extends Command {}
class CommandHandlerDecoratorSpecCommand2 extends Command {}

class CommandHandlerDecoratorSpecCommandHandler1 extends AnnotatedCommandHandler {
    public handleSomethingCalled: boolean = false;
    public handleSomethingElseCalled: boolean = false;

    @CommandHandler()
    public handleSomething(command: CommandHandlerDecoratorSpecCommand1): void {
        this.handleSomethingCalled = true;
    }

    @CommandHandler()
    public handleSomethingElse(command: CommandHandlerDecoratorSpecCommand2): void {
        this.handleSomethingElseCalled = true;
    }
}

class CommandHandlerDecoratorSpecCommandHandler2 extends AnnotatedCommandHandler {
    public handleAnotherThingCalled: boolean = false;

    @CommandHandler()
    public handleAnotherThing(command: CommandHandlerDecoratorSpecCommand1): void {
        this.handleAnotherThingCalled = true;
    }
}

@Mixin(AnnotatedCommandHandler)
class CommandHandlerDecoratorSpecMixedInCommandHandler implements AnnotatedCommandHandler {
    handle: (command: Command) => Promise<void>;
    getSupportedCommands: () => Set<CommandType>;

    public handleSomethingCalled: boolean = false;

    @CommandHandler()
    public handleSomething(command: CommandHandlerDecoratorSpecCommand1): void {
        this.handleSomethingCalled = true;
    }
}
