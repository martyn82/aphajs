
import "reflect-metadata";
import {expect} from "chai";
import {MetadataKeys} from "../../../main/Apha/Decorators/MetadataKeys";
import {AnnotatedEventListener} from "../../../main/Apha/EventHandling/AnnotatedEventListener";
import {Event} from "../../../main/Apha/Message/Event";
import {EventListener, defineDeferredEventListeners} from "../../../main/Apha/EventHandling/EventListenerDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";
import {UnsupportedEventException} from "../../../main/Apha/EventHandling/UnsupportedEventException";

const EVENT_HANDLERS = "annotations:eventhandlers";
const DEFERRED = "annotations:deferredeventhandlers";

describe("EventListenerDecorator", () => {
    describe("EventListener", () => {
        it("should define method as an event handler", () => {
            const target = new EventListenerDecoratorSpecTarget();

            let handlers = Reflect.getMetadata(EVENT_HANDLERS, target);
            expect(handlers).to.be.undefined;

            const methodName = "onSomething";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            EventListener()(target, methodName, descriptor);

            handlers = Reflect.getMetadata(EVENT_HANDLERS, target);
            expect(handlers).not.to.be.undefined;
            expect(handlers["Something"]).to.equal(target[methodName]);
        });

        it("should throw exception if no parameter can be found", () => {
            const target = new EventListenerDecoratorSpecInvalidTarget();
            const methodName = "onNothing";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };

            expect(() => {
                EventListener()(target, methodName, descriptor);
            }).to.throw(DecoratorException);
        });

        it("should add handler to deferred list if reference to event type is given", () => {
            const target = new EventListenerDecoratorSpecDeferredTarget();
            const methodName = "handleThis";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };
            const eventDescriptor = {type: EventListenerDecoratorSpecDeferredTarget, eventName: "Something"};

            EventListener(eventDescriptor)(target, methodName, descriptor);

            const deferred = Reflect.getMetadata(DEFERRED, target);
            expect(deferred).to.eql([{
                methodName: methodName,
                descriptor: descriptor,
                event: eventDescriptor
            }]);
        });
    });

    describe("EventListenerDispatcher", () => {
        it("should throw exception if no handlers are defined", () => {
            const target = new EventListenerDecoratorSpecNoHandler();

            expect(() => {
                target.on(new Something());
            }).to.throw(UnsupportedEventException);
        });
    });

    describe("defineDeferredEventListeners", () => {
        it("should define a deferred event listener", () => {
            const target = new EventListenerDecoratorSpecDeferredTarget();
            const methodName = "onThis";
            const descriptor = {
                value: target[methodName],
                writable: true,
                enumerable: false,
                configurable: false
            };
            const eventDescription = {type: EventListenerDecoratorSpecDeferredTarget, eventName: "Something"};
            const deferred = [{
                methodName: methodName,
                descriptor: descriptor,
                event: eventDescription
            }];
            Reflect.defineMetadata(DEFERRED, deferred, target);

            defineDeferredEventListeners(target);

            expect(Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName)).to.eql(
                [EventListenerDecoratorSpecDeferredTarget.Something]
            );
        });
    });
});

class Something extends Event {}
class EventListenerDecoratorSpecTarget extends AnnotatedEventListener {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [Something])
    public onSomething(event: Something): void {
    }
}

class EventListenerDecoratorSpecInvalidTarget extends AnnotatedEventListener {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [])
    public onNothing(): void {
    }
}

class EventListenerDecoratorSpecNoHandler extends AnnotatedEventListener {
}

class EventListenerDecoratorSpecDeferredTarget extends AnnotatedEventListener {
    @Reflect.metadata(MetadataKeys.PARAM_TYPES, [undefined])
    public onThis(event: EventListenerDecoratorSpecDeferredTarget.Something): void {
    }
}

namespace EventListenerDecoratorSpecDeferredTarget {
    export class Something extends Event {}
}
