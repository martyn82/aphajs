
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {MemoryScheduleStorage} from "../../../../main/Apha/Scheduling/Storage/MemoryScheduleStorage";
import {ScheduledEvent} from "../../../../main/Apha/Scheduling/Storage/ScheduleStorage";
import {Event} from "../../../../main/Apha/Message/Event";

chai.use(chaiAsPromised);

describe("MemoryScheduleStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryScheduleStorage();
    });

    describe("add", () => {
        it("stores a scheduled event into storage", (done) => {
            const schedule: ScheduledEvent = {
                event: new MemoryScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            expect(storage.add(schedule)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findAll()).to.eventually.be.fulfilled.and.satisfy(allSchedule => {
                    return allSchedule[0] === schedule;
                }).and.notify(done);
            }, done.fail);
        });
    });

    describe("remove", () => {
        it("removes a scheduled event from storage", (done) => {
            expect(storage.add({
                event: new MemoryScheduleStorageSpecEvent(),
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
                event: new MemoryScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            expect(storage.add(schedule)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findAll()).to.eventually.have.lengthOf(1).and.notify(done);
            }, done.fail);
        });
    });
});

class MemoryScheduleStorageSpecEvent extends Event {}
