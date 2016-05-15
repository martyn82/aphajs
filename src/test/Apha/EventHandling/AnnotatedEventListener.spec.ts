
import {expect} from "chai";
import {AnnotatedEventListener} from "../../../main/Apha/EventHandling/AnnotatedEventListener";
import {Event} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/EventHandling/EventListenerDecorator";

describe("AnnotatedEventListener", () => {
    describe("on", () => {
        it("invokes correct handler", () => {
            let handler = new EventListenerDecoratorSpecEventListener1();
            let event = new EventListenerDecoratorSpecEvent1();

            handler.on(event);

            expect(handler.onSomethingCalled).to.equal(true);
        });

        it("invokes correct handlers", () => {
            let handler = new EventListenerDecoratorSpecEventListener1();
            let event = new EventListenerDecoratorSpecEvent2();

            handler.on(event);

            expect(handler.onSomethingElseCalled).to.equal(true);
        });
    });
});

class EventListenerDecoratorSpecEvent1 extends Event {}
class EventListenerDecoratorSpecEvent2 extends Event {}

class EventListenerDecoratorSpecEventListener1 extends AnnotatedEventListener {
    public onSomethingCalled: boolean = false;
    public onSomethingElseCalled: boolean = false;

    @EventListener
    public onSomething(event: EventListenerDecoratorSpecEvent1): void {
        this.onSomethingCalled = true;
    }

    @EventListener
    public onSomethingElse(event: EventListenerDecoratorSpecEvent2): void {
        this.onSomethingElseCalled = true;
    }
}

class EventListenerDecoratorSpecEventListener2 extends AnnotatedEventListener {
    public onAnotherThingCalled: boolean = false;

    @EventListener
    public onAnotherThing(event: EventListenerDecoratorSpecEvent1): void {
        this.onAnotherThingCalled = true;
    }
}
