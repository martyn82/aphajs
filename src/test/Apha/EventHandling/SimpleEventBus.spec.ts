
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
            let event = new SimpleEventBusEvent();
            let listener = new SimpleEventBusEventListener();

            let listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            eventBus.subscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(true);

            listenerMock.verify();
        });

        it("publishes event only once to the same listener", () => {
            let event = new SimpleEventBusEvent();
            let listener = new SimpleEventBusEventListener();

            let listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            eventBus.subscribe(listener);
            eventBus.subscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(true);

            listenerMock.verify();
        });

        it("returns false if no listener subscribed to the event", () => {
            let event = new SimpleEventBusEvent();
            expect(eventBus.publish(event)).to.equal(false);
        });

        it("publishes event to multiple listeners", () => {
            let event = new SimpleEventBusEvent();
            let listener1 = new SimpleEventBusEventListener();
            let listener2 = new SimpleEventBusEventListener();

            let listenerMock1 = sinon.mock(listener1);
            listenerMock1.expects("on").once().withArgs(event);

            let listenerMock2 = sinon.mock(listener2);
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
            let event = new SimpleEventBusEvent();
            let listener = new SimpleEventBusEventListener();

            eventBus.subscribe(listener, SimpleEventBusEvent);
            eventBus.unsubscribe(listener, SimpleEventBusEvent);

            expect(eventBus.publish(event)).to.equal(false);
        });

        it("is idempotent", () => {
            let listener = new SimpleEventBusEventListener();

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
