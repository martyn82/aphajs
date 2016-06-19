
import "reflect-metadata";
import {expect} from "chai";
import {MetadataKeys} from "../../../main/Apha/Decorators/MetadataKeys";
import {AnnotatedCommandHandler} from "../../../main/Apha/CommandHandling/AnnotatedCommandHandler";
import {Command} from "../../../main/Apha/Message/Command";
import {
    CommandHandler,
    defineDeferredCommandHandlers
} from "../../../main/Apha/CommandHandling/CommandHandlerDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";
import {UnsupportedCommandException} from "../../../main/Apha/CommandHandling/UnsupportedCommandException";

const COMMAND_HANDLERS = "annotations:commandhandlers";
const DEFERRED = "annotations:deferredcommandhandlers";

describe("CommandHandlerDecorator", () => {
    describe("CommandHandler", () => {
        it("should define method as a command handler", () => {
            const target = new CommandHandlerDecoratorSpecTarget();

            let handlers: Map<string, Function> = Reflect.getMetadata(COMMAND_HANDLERS, target);
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
            expect(handlers.get("Something")).to.equal(target[methodName]);
        });

        it("should throw exception if no parameter can be found", () => {
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

        it("should add handler to deferred list if reference to command type is given", () => {
            const target = new CommandHandlerDecoratorSpecDeferredTarget();
            const methodName = "handleThis";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };
            const commandDescriptor = {type: CommandHandlerDecoratorSpecDeferredTarget, commandName: "Something"};

            CommandHandler(commandDescriptor)(target, methodName, descriptor);

            const deferred = Reflect.getMetadata(DEFERRED, target);
            expect(deferred).to.eql([{
                methodName: methodName,
                descriptor: descriptor,
                command: commandDescriptor
            }]);
        });
    });

    describe("CommandHandlerDispatcher", () => {
        it("should throw exception if no handlers are defined", () => {
            const target = new CommandHandlerDecoratorSpecNoHandler();

            expect(() => {
                target.handle(new Something());
            }).to.throw(UnsupportedCommandException);
        });
    });

    describe("defineDeferredCommandHandlers", () => {
        it("should define a deferred command handler", () => {
            const target = new CommandHandlerDecoratorSpecDeferredTarget();
            const methodName = "handleThis";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };
            const commandDescriptor = {type: CommandHandlerDecoratorSpecDeferredTarget, commandName: "Something"};
            const deferred = [{
                methodName: methodName,
                descriptor: descriptor,
                command: commandDescriptor
            }];
            Reflect.defineMetadata(DEFERRED, deferred, target);

            defineDeferredCommandHandlers(target);

            expect(Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName)).to.eql(
                [CommandHandlerDecoratorSpecDeferredTarget.Something]
            );
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

class CommandHandlerDecoratorSpecDeferredTarget extends AnnotatedCommandHandler {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [undefined])
    public handleThis(command: CommandHandlerDecoratorSpecDeferredTarget.Something): void {
    }
}

namespace CommandHandlerDecoratorSpecDeferredTarget {
    export class Something extends Command {}
}
