
import {expect} from "chai";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {UnknownEventException} from "../../../main/Apha/EventStore/UnknownEventException";

describe("EventClassMap", () => {
    describe("getTypeByClassName", () => {
        it("should retrieve type by event class name", () => {
            const events = new Set<EventType>();
            events.add(EventClassMapEvent);

            const classMap = new EventClassMap(events);
            const classType = classMap.getTypeByClassName("EventClassMapEvent");

            expect(classType).to.equal(EventClassMapEvent);
        });

        it("should throw exception if class cannot be found", () => {
            const classMap = new EventClassMap();

            expect(() => {
                classMap.getTypeByClassName("foo");
            }).to.throw(UnknownEventException);
        });
    });

    describe("register", () => {
        it("should register an event in the map", () => {
            const classMap = new EventClassMap();
            classMap.register(EventClassMapEvent);

            expect(classMap.getTypeByClassName("EventClassMapEvent")).to.equal(EventClassMapEvent);
        });
    });

    describe("unregister", () => {
        it("should unregister an event from the map", () => {
            const classMap = new EventClassMap();
            classMap.register(EventClassMapEvent);
            classMap.unregister(EventClassMapEvent);

            expect(() => {
                classMap.getTypeByClassName("EventClassMapEvent");
            }).to.throw(UnknownEventException);
        });

        it("should be idempotent", () => {
            const classMap = new EventClassMap();

            expect(() => {
                classMap.unregister(EventClassMapEvent);
            }).to.not.throw();
        });
    });
});

class EventClassMapEvent extends Event {}
