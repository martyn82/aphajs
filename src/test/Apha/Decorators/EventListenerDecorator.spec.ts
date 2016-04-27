
import {expect} from "chai";
import {AnnotatedEventListener} from "../../../main/Apha/EventHandling/AnnotatedEventListener";
import {Event} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/Decorators/EventListenerDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";
import {UnsupportedEventException} from "../../../main/Apha/EventHandling/UnsupportedEventException";

const ANNOTATIONS_EVENTLISTENERS_METADATA_KEY = "annotations:eventlisteners";

describe("EventListenerDecorator", () => {
    describe("EventListener", () => {
        it("defines method as an event handler", () => {
            let target = new EventListenerDecoratorSpecTarget();

            let handlers = Reflect.getMetadata(ANNOTATIONS_EVENTLISTENERS_METADATA_KEY, target);
            expect(handlers).to.be.undefined;

            let methodName = "onSomething";
            let descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            EventListener(target, methodName, descriptor);

            handlers = Reflect.getMetadata(ANNOTATIONS_EVENTLISTENERS_METADATA_KEY, target);
            expect(handlers).not.to.be.undefined;
            expect(handlers["Something"]).to.equal(target[methodName]);
        });

        it("throws exception if no parameter can be found", () => {
            let target = new EventListenerDecoratorSpecInvalidTarget();
            let methodName = "onNothing";
            let descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            expect(() => {
                EventListener(target, methodName, descriptor);
            }).to.throw(DecoratorException);
        });
    });

    describe("EventListenerDispatcher", () => {
        it("throws exception if no handlers are defined", () => {
            let target = new EventListenerDecoratorSpecNoHandler();

            expect(() => {
                target.on(new Something());
            }).to.throw(UnsupportedEventException);
        });
    });
});

class Something extends Event {}
class EventListenerDecoratorSpecTarget extends AnnotatedEventListener {
    @Reflect.metadata("design:paramtypes", [Something])
    public onSomething(event: Something): void {
    }
}

class EventListenerDecoratorSpecInvalidTarget extends AnnotatedEventListener {
    @Reflect.metadata("design:paramtypes", [])
    public onNothing(): void {
    }
}

class EventListenerDecoratorSpecNoHandler extends AnnotatedEventListener {
}

