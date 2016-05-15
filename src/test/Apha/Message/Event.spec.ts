
import {expect} from "chai";
import {Event} from "../../../main/Apha/Message/Event";

describe("Event", () => {
    describe("version", () => {
        it("can be 'get'", () => {
            let event = new EventSpecEvent("id", 0);
            expect(event.version).to.equal(0);
        });

        it("can be 'set'", () => {
            let event = new EventSpecEvent("id", 0);
            event.version = 1;
            expect(event.version).to.equal(1);
        });
    });

    describe("id", () => {
        it("can be 'get'", () => {
            let event = new EventSpecEvent("id", 0);
            expect(event.id).to.equal("id");
        });
    });
});

class EventSpecEvent extends Event {
    constructor(id: string, version: number) {
        super();
        this._id = id;
        this.version = version;
    }
}
