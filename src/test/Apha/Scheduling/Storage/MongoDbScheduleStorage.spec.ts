
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {ScheduledEvent} from "../../../../main/Apha/Scheduling/Storage/ScheduleStorage";
import {Event, EventType} from "../../../../main/Apha/Message/Event";
import {MongoClient} from "mongodb";
import {MongoDbScheduleStorage} from "../../../../main/Apha/Scheduling/Storage/MongoDbScheduleStorage";
import {JsonSerializer} from "../../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../../main/Apha/EventStore/EventClassMap";

chai.use(chaiAsPromised);

describe("MongoDbScheduleStorage", () => {
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
        const collection = mongoDb.collection("schedules");

        const events = new Set<EventType>();
        events.add(MongoDbScheduleStorageSpecEvent);
        storage = new MongoDbScheduleStorage(collection, new JsonSerializer(), new EventClassMap(events));
    });

    afterEach(done => {
        mongoDb.dropCollection("schedules").then(() => done());
    });

    describe("add", () => {
        it("stores a scheduled event into storage", (done) => {
            const schedule: ScheduledEvent = {
                event: new MongoDbScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            expect(storage.add(schedule)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findAll()).to.eventually.be.fulfilled.and.satisfy(allSchedule => {
                    return allSchedule[0].token === schedule.token &&
                        allSchedule[0].event.fullyQualifiedName === schedule.event.fullyQualifiedName &&
                        allSchedule[0].timestamp === schedule.timestamp;
                }).and.notify(done);
            }, done.fail);
        });
    });

    describe("remove", () => {
        it("removes a scheduled event from storage", (done) => {
            expect(storage.add({
                event: new MongoDbScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            })).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.remove("foo")).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.findAll()).to.eventually.have.lengthOf(0).and.notify(done);
                }, done.fail);
            }, done.fail);
        });

        it("is idempotent", (done) => {
            expect(storage.remove("foo")).to.eventually.be.fulfilled.and.notify(done);
        });
    });

    describe("findAll", () => {
        it("retrieves all scheduled events from storage", (done) => {
            const schedule: ScheduledEvent = {
                event: new MongoDbScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            expect(storage.add(schedule)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findAll()).to.eventually.have.lengthOf(1).and.notify(done);
            }, done.fail);
        });
    });
});

class MongoDbScheduleStorageSpecEvent extends Event {}
