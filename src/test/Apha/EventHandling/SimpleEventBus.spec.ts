
import * as sinon from "sinon";
import {expect} from "chai";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {Event} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";

describe("SimpleEventBus", () => {
    let eventBus;

    beforeEach(() => {
        eventBus = new SimpleEventBus();
    });

    describe("publish", () => {
        it("publishes event to subscribed listener", () => {
            const event = new SimpleEventBusEvent();
            const listener = new SimpleEventBusEventListener();

            const listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            eventBus.subscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(true);

            listenerMock.verify();
        });

        it("publishes event only once to the same listener", () => {
            const event = new SimpleEventBusEvent();
            const listener = new SimpleEventBusEventListener();

            const listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            eventBus.subscribe(listener);
            eventBus.subscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(true);

            listenerMock.verify();
        });

        it("returns false if no listener subscribed to the event", () => {
            const event = new SimpleEventBusEvent();
            expect(eventBus.publish(event)).to.equal(false);
        });

        it("publishes event to multiple listeners", () => {
            const event = new SimpleEventBusEvent();
            const listener1 = new SimpleEventBusEventListener();
            const listener2 = new SimpleEventBusEventListener();

            const listenerMock1 = sinon.mock(listener1);
            listenerMock1.expects("on").once().withArgs(event);

            const listenerMock2 = sinon.mock(listener2);
            listenerMock2.expects("on").once().withArgs(event);

            eventBus.subscribe(listener1, SimpleEventBusEvent);
            eventBus.subscribe(listener2, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(true);

            listenerMock1.verify();
            listenerMock2.verify();
        });
    });

    describe("unsubscribe", () => {
        it("unsubscribes a previously subscribed listener", () => {
            const event = new SimpleEventBusEvent();
            const listener = new SimpleEventBusEventListener();

            eventBus.subscribe(listener, SimpleEventBusEvent);
            eventBus.unsubscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(false);
        });

        it("is idempotent", () => {
            const listener = new SimpleEventBusEventListener();

            eventBus.subscribe(new SimpleEventBusEventListener(), SimpleEventBusEvent);

            eventBus.unsubscribe(listener, SimpleEventBusEvent);
            eventBus.unsubscribe(listener, SimpleEventBusEvent2);
        });
    });
});

class SimpleEventBusEvent extends Event {}
class SimpleEventBusEvent2 extends Event {}
class SimpleEventBusEventListener implements EventListener {
    public on(event: Event): void {}
}
