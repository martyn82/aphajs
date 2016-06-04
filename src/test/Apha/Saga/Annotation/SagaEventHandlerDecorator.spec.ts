
import "reflect-metadata";
import {expect} from "chai";
import {AnnotatedSaga} from "./../../../../main/Apha/Saga/Annotation/AnnotatedSaga";
import {Event} from "../../../../main/Apha/Message/Event";
import {MetadataKeys} from "../../../../main/Apha/Decorators/MetadataKeys";
import {
    SagaEventHandler,
    SagaEventHandlerDecorator
} from "../../../../main/Apha/Saga/Annotation/SagaEventHandlerDecorator";
import {DecoratorException} from "../../../../main/Apha/Decorators/DecoratorException";
import {UnsupportedEventException} from "../../../../main/Apha/EventHandling/UnsupportedEventException";
import {DefaultParameterResolver} from "../../../../main/Apha/Saga/Annotation/DefaultParameterResolver";

describe("SagaEventHandlerDecorator", () => {
    describe("SagaEventHandler", () => {
        it("defines method as saga event handler", () => {
            const target = new SagaEventHandlerDecoratorSpecTarget("id");

            let handlers = Reflect.getMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, target);
            expect(handlers).to.be.undefined;

            const methodName = "onSomething";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            SagaEventHandler()(target, methodName, descriptor);

            handlers = Reflect.getMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, target);
            expect(handlers).not.to.be.undefined;
            expect(handlers["Something"]).to.eql([target[methodName], undefined]);
        });

        it("associates a saga with a property if specified", () => {
            const target = new SagaEventHandlerDecoratorSpecTarget("id");
            target.setParameterResolver(new DefaultParameterResolver());

            let handlers = Reflect.getMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, target);
            expect(handlers).to.be.undefined;

            const methodName = "onSomething";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            SagaEventHandler({associationProperty: "id"})(target, methodName, descriptor);

            handlers = Reflect.getMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, target);
            expect(handlers).not.to.be.undefined;
            expect(handlers["Something"]).to.eql([target[methodName], "id"]);
        });

        it("throws exception if no parameter can be found", () => {
            const target = new SagaEventHandlerDecoratorSpecInvalidTarget("id");
            const methodName = "onNothing";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            expect(() => {
                SagaEventHandler()(target, methodName, descriptor);
            }).to.throw(DecoratorException);
        });
    });

    describe("SagaEventHandlerDispatcher", () => {
        it("throws exception if no handlers are defined", () => {
            const target = new SagaEventHandlerDecoratorSpecNoHandler("id");

            expect(() => {
                target.on(new Something());
            }).to.throw(UnsupportedEventException);
        });
    });
});

class Something extends Event {}
class SagaEventHandlerDecoratorSpecTarget extends AnnotatedSaga {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [Something])
    public onSomething(event: Something): void {
    }
}

class SagaEventHandlerDecoratorSpecInvalidTarget extends AnnotatedSaga {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [])
    public onNothing(): void {
    }
}

class SagaEventHandlerDecoratorSpecNoHandler extends AnnotatedSaga {
}
