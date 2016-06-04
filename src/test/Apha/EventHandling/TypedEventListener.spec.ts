
import * as sinon from "sinon";
import {expect} from "chai";
import {TypedEventListener} from "../../../main/Apha/EventHandling/TypedEventListener";
import {Event} from "../../../main/Apha/Message/Event";
import {UnsupportedEventException} from "../../../main/Apha/EventHandling/UnsupportedEventException";

describe("TypedEventListener", () => {
    let listener;
    let listenerMock;

    beforeEach(() => {
        listener = new TypedEventListenerSpecTypedEventListener();
        listenerMock = sinon.mock(listener);
    });

    describe("on", () => {
        it("dispatches event to appropriate handler", () => {
            const event = new TypedEventListenerSpecEvent();
            listenerMock.expects("onTypedEventListenerSpecEvent")
                .once()
                .withArgs(event);

            listener.on(event);
            listenerMock.verify();
        });

        it("throws exception if event cannot be handled", () => {
            const event = new TypedEventListenerSpecEvent2();

            expect(() => {
                listener.on(event);
            }).to.throw(UnsupportedEventException);
        });
    });
});

class TypedEventListenerSpecEvent extends Event {}
class TypedEventListenerSpecEvent2 extends Event {}
class TypedEventListenerSpecTypedEventListener extends TypedEventListener {
    public onTypedEventListenerSpecEvent(event: TypedEventListenerSpecEvent): void {
    }
}
