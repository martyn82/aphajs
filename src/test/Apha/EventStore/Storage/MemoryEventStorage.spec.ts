
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {MemoryEventStorage} from "../../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {EventDescriptor} from "../../../../main/Apha/EventStore/EventDescriptor";

chai.use(chaiAsPromised);

describe("MemoryEventStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryEventStorage();
    });

    describe("findIdentities", () => {
        it("retrieves all identities in the storage", (done) => {
            const aggregateId = "id";
            const event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            expect(storage.append(event)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findIdentities()).to.eventually.be.fulfilled.and.satisfy(identities => {
                    return identities.size === 1 && identities.values().next().value === aggregateId;
                }).and.notify(done);
            }, error => done(error));
        });

        it("retrieves an empty set if storage is empty", (done) => {
            expect(storage.findIdentities()).to.eventually.have.property("size", 0).and.notify(done);
        });
    });

    describe("find", () => {
        it("retrieves all events by aggregate ID", (done) => {
            const aggregateId = "id";
            const descriptors = [
                EventDescriptor.record(aggregateId, "type", "event", "{}", 1),
                EventDescriptor.record(aggregateId, "type", "event", "{}", 2),
            ];

            descriptors.forEach(async (descriptor) => {
                await storage.append(descriptor);
            });

            const promisedEvents = storage.find(aggregateId);
            expect(promisedEvents).to.eventually.have.lengthOf(descriptors.length).and.notify(done);
        });

        it("retrieves an empty array if aggregate is unknown", (done) => {
            expect(storage.find("id")).to.eventually.have.lengthOf(0).and.notify(done);
        });
    });

    describe("append", () => {
        it("stores an event to storage", (done) => {
            const aggregateId = "id";
            const event = EventDescriptor.record(aggregateId, "type", "eventtype", "{}", 1);

            expect(storage.append(event)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findIdentities()).to.eventually.be.fulfilled.and.satisfy(identities => {
                    return identities.size === 1 && identities.values().next().value === aggregateId;
                }).and.notify(done);
            }, error => done(error));
        });
    });

    describe("contains", () => {
        it("returns false if an ID does not exist in storage", (done) => {
            expect(storage.contains("id")).to.eventually.equal(false).and.notify(done);
        });

        it("returns true if an ID exists in storage", (done) => {
            storage.append(EventDescriptor.record("id", "type", "event", "{}", 1)).then(() => {
                expect(storage.contains("id")).to.eventually.equal(true).and.notify(done);
            }, error => done(error));
        });
    });

    describe("clear", () => {
        it("should clear all from storage", () => {
            const aggregateId = "some-id";
            const eventDescriptor = EventDescriptor.record(aggregateId, "type", "event", "{}", 1);

            return Promise.all([
                expect(storage.append(eventDescriptor)).to.eventually.be.fulfilled,
                expect(storage.clear()).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.contains(aggregateId)).to.eventually.be.false;
                })
            ]);
        });
    });
});
