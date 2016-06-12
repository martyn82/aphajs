
import "reflect-metadata";
import {expect} from "chai";
import {MetadataKeys} from "../../../main/Apha/Decorators/MetadataKeys";
import {AnnotatedCommandHandler} from "../../../main/Apha/CommandHandling/AnnotatedCommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {CommandHandler} from "../../../main/Apha/CommandHandling/CommandHandlerDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";
import {UnsupportedCommandException} from "../../../main/Apha/CommandHandling/UnsupportedCommandException";

const COMMAND_HANDLERS = "annotations:commandhandlers";

describe("CommandHandlerDecorator", () => {
    describe("CommandHandler", () => {
        it("defines method as a command handler", () => {
            const target = new CommandHandlerDecoratorSpecTarget();

            let handlers = Reflect.getMetadata(COMMAND_HANDLERS, target);
            expect(handlers).to.be.undefined;

            const methodName = "handleSomething";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            CommandHandler()(target, methodName, descriptor);

            handlers = Reflect.getMetadata(COMMAND_HANDLERS, target);
            expect(handlers).not.to.be.undefined;
            expect(handlers["Something"]).to.equal(target[methodName]);
        });

        it("throws exception if no parameter can be found", () => {
            const target = new CommandHandlerDecoratorSpecInvalidTarget();
            const methodName = "handleNothing";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            expect(() => {
                CommandHandler()(target, methodName, descriptor);
            }).to.throw(DecoratorException);
        });
    });

    describe("CommandHandlerDispatcher", () => {
        it("throws exception if no handlers are defined", () => {
            const target = new CommandHandlerDecoratorSpecNoHandler();

            expect(() => {
                target.handle(new Something());
            }).to.throw(UnsupportedCommandException);
        });
    });
});

class Something extends Command {}
class CommandHandlerDecoratorSpecTarget extends AnnotatedCommandHandler {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [Something])
    public handleSomething(command: Something): void {
    }
}

class CommandHandlerDecoratorSpecInvalidTarget extends AnnotatedCommandHandler {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [])
    public handleNothing(): void {
    }
}

class CommandHandlerDecoratorSpecNoHandler extends AnnotatedCommandHandler {
}
