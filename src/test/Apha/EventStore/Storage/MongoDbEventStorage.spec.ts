
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {MongoDbEventStorage} from "../../../../main/Apha/EventStore/Storage/MongoDbEventStorage";
import {MongoClient} from "mongodb";
import {EventDescriptor} from "../../../../main/Apha/EventStore/EventDescriptor";

chai.use(chaiAsPromised);

describe("MongoDbEventStorage", () => {
    let mongoDb;
    let storage;

    before(done => {
        MongoClient.connect("mongodb://localhost:27017/test").then(db => {
            mongoDb = db;
            done();
        });
    });

    after(done => {
        mongoDb.dropDatabase().then(() => {
            mongoDb.close();
            done();
        });
    });

    beforeEach(() => {
        const collection = mongoDb.collection("events");
        storage = new MongoDbEventStorage(collection);
    });

    afterEach(done => {
        mongoDb.dropCollection("events").then(() => done(), () => done());
    });

    describe("append", () => {
        it("should insert an event into storage", (done) => {
            const eventDescriptor = new EventDescriptor(
                "some-id",
                "SomeType",
                "EventType",
                "payload",
                "recorded",
                1
            );

            expect(storage.append(eventDescriptor)).to.eventually.be.true.and.notify(done);
        });
    });

    describe("findIdentities", () => {
        it("should retrieve all stored identities", (done) => {
            const aggregateId = "some-id";
            const eventDescriptor = EventDescriptor.record(aggregateId, "AggregateType", "EventType", "{}", 1);

            expect(storage.append(eventDescriptor)).to.eventually.be.fulfilled.then(() => {
                expect(storage.findIdentities()).to.eventually.be.fulfilled.and.satisfy(identities => {
                    return identities.values().next().value === aggregateId && identities.size === 1;
                }).and.notify(done);
            }, done.fail);
        });

        it("should return an empty set if no identities are stored", (done) => {
            expect(storage.findIdentities()).to.eventually.have.property("size", 0).and.notify(done);
        });
    });

    describe("find", () => {
        it("should retrieve all events for aggregate with given ID", (done) => {
            const aggregateId = "id";
            const descriptors = [
                EventDescriptor.record(aggregateId, "type", "event", "{}", 1),
                EventDescriptor.record(aggregateId, "type", "event", "{}", 2),
            ];

            const promisedAppends = [];
            descriptors.forEach(descriptor => {
                promisedAppends.push(storage.append(descriptor));
            });

            expect(Promise.all(promisedAppends)).to.eventually.be.fulfilled.then(() => {
                expect(storage.find(aggregateId)).to.eventually.have.lengthOf(descriptors.length).and.notify(done);
            }, done.fail);
        });

        it("should return an empty array if aggregate is unknown", (done) => {
            expect(storage.find("id")).to.eventually.have.lengthOf(0).and.notify(done);
        });
    });

    describe("contains", () => {
        it("should return true if an aggregate ID exists in storage", () => {
            const aggregateId = "some-id";
            const eventDescriptor = EventDescriptor.record(aggregateId, "AggregateType", "EventType", "{}", 1);

            return Promise.all([
                expect(storage.append(eventDescriptor)).to.eventually.be.fulfilled,
                expect(storage.contains(aggregateId)).to.eventually.be.true
            ]);
        });

        it("should return false if an aggregate ID does not exist in storage", (done) => {
            expect(storage.contains("some-id")).to.eventually.be.false.and.notify(done);
        });
    });

    describe("clear", () => {
        it("should clear all from storage", (done) => {
            const aggregateId = "some-id";
            const eventDescriptor = EventDescriptor.record(aggregateId, "type", "event", "{}", 1);

            expect(storage.append(eventDescriptor)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.clear()).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.contains(aggregateId)).to.eventually.be.false.and.notify(done);
                }, done.fail);
            }, done.fail);
        });
    });
});
