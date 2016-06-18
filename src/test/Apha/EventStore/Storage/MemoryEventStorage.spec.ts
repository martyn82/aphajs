
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
            const aggregateId = "id";
            const event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            storage.append(event);

            const identities = storage.findIdentities();
            expect(identities.size).to.equal(1);
            expect(identities.values().next().value).to.equal(aggregateId);
        });

        it("retrieves an empty array if storage is empty", () => {
            const identities = storage.findIdentities();
            expect(identities.size).to.equal(0);
        });
    });

    describe("find", () => {
        it("retrieves all events by aggregate ID", () => {
            const aggregateId = "id";
            const descriptors = [
                EventDescriptor.record(aggregateId, "type", "event", "{}", 1),
                EventDescriptor.record(aggregateId, "type", "event", "{}", 2),
            ];

            descriptors.forEach((descriptor) => {
                storage.append(descriptor);
            });

            const events = storage.find(aggregateId);
            expect(events).to.have.lengthOf(descriptors.length);
        });

        it("retrieves an empty array if aggregate is unknown", () => {
            const events = storage.find("id");
            expect(events).to.have.lengthOf(0);
        });
    });

    describe("append", () => {
        it("stores an event to storage", () => {
            const aggregateId = "id";
            const event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            storage.append(event);

            const identities = storage.findIdentities();

            expect(identities.size).to.equal(1);
            expect(identities.values().next().value).to.equal(aggregateId);
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
