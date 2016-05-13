
import {expect} from "chai";
import {MemoryScheduleStorage} from "../../../../main/Apha/Scheduling/Storage/MemoryScheduleStorage";
import {ScheduledEvent} from "../../../../main/Apha/Scheduling/Storage/ScheduleStorage";
import {Event} from "../../../../main/Apha/Message/Event";

describe("MemoryScheduleStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryScheduleStorage();
    });

    describe("add", () => {
        it("stores a scheduled event into storage", () => {
            let schedule: ScheduledEvent = {
                event: new MemoryScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            storage.add(schedule);
            let allSchedule = storage.findAll();

            expect(allSchedule[0]).to.eql(schedule);
        });
    });

    describe("remove", () => {
        it("removes a scheduled event from storage", () => {
            storage.add({
                event: new MemoryScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            });

            storage.remove("foo");

            expect(storage.findAll()).to.have.lengthOf(0);
        });

        it("is idempotent", () => {
            expect(() => {
                storage.remove("foo");
            }).not.to.throw(Error);
        });
    });

    describe("findAll", () => {
        it("retrieves all scheduled events from storage", () => {
            let schedule: ScheduledEvent = {
                event: new MemoryScheduleStorageSpecEvent(),
                timestamp: 1,
                token: "foo"
            };

            storage.add(schedule);

            expect(storage.findAll()).to.have.lengthOf(1);
        });
    });
});

class MemoryScheduleStorageSpecEvent extends Event {}
