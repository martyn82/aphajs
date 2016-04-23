
import {expect} from "chai";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {Event} from "../../../main/Apha/Message/Event";
import {UnknownEventException} from "../../../main/Apha/EventStore/UnknownEventException";

describe("EventClassMap", () => {
    describe("getTypeByClassName", () => {
        it("retrieves type by event class name", () => {
            let classMap = new EventClassMap([EventClassMapEvent]);
            let classType = classMap.getTypeByClassName("EventClassMapEvent");

            expect(classType).to.equal(EventClassMapEvent);
        });

        it("throws exception if class cannot be found", () => {
            let classMap = new EventClassMap([]);

            expect(() => {
                classMap.getTypeByClassName("foo");
            }).to.throw(UnknownEventException);
        });
    });
});

class EventClassMapEvent extends Event {
}
