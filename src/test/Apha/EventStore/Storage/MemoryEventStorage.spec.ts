
import {expect} from "chai";
import {MemoryEventStorage} from "../../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {EventDescriptor} from "../../../../main/Apha/EventStore/EventDescriptor";

describe("MemoryEventStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryEventStorage();
    });

    describe("findIdentities", () => {
        it("retrieves all identities in the storage", () => {
            let aggregateId = "id";
            let event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            storage.append(event);

            let identities = storage.findIdentities();
            expect(identities).to.have.lengthOf(1);
            expect(identities[0]).to.equal(aggregateId);
        });

        it("retrieves an empty array if storage is empty", () => {
            let identities = storage.findIdentities();
            expect(identities).to.have.lengthOf(0);
        });
    });

    describe("find", () => {
        it("retrieves all events by aggregate ID", () => {
            let aggregateId = "id";
            let descriptors = [
                EventDescriptor.record(aggregateId, "type", "event", "{}", 1),
                EventDescriptor.record(aggregateId, "type", "event", "{}", 2),
            ];

            descriptors.forEach((descriptor) => {
                storage.append(descriptor);
            });

            let events = storage.find(aggregateId);
            expect(events).to.have.lengthOf(descriptors.length);
        });

        it("retrieves an empty array if aggregate is unknown", () => {
            let events = storage.find("id");
            expect(events).to.have.lengthOf(0);
        });
    });

    describe("append", () => {
        it("stores an event to storage", () => {
            let aggregateId = "id";
            let event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            storage.append(event);

            let identities = storage.findIdentities();

            expect(identities).to.have.lengthOf(1);
            expect(identities[0]).to.equal(aggregateId);
        });
    });

    describe("contains", () => {
        it("returns false if an ID does not exist in storage", () => {
            expect(storage.contains("id")).to.equal(false);
        });

        it("returns true if an ID exists in storage", () => {
            storage.append(EventDescriptor.record("id", "type", "event", "{}", 1));
            expect(storage.contains("id")).to.equal(true);
        });
    });
});
