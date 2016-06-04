
import * as sinon from "sinon";
import {expect} from "chai";
import {SimpleEventScheduler} from "../../../main/Apha/Scheduling/SimpleEventScheduler";
import {EventBus} from "../../../main/Apha/EventHandling/EventBus";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {ScheduleStorage, ScheduledEvent} from "../../../main/Apha/Scheduling/Storage/ScheduleStorage";
import {TimeUnit} from "../../../main/Apha/Scheduling/EventScheduler";

describe("SimpleEventScheduler", () => {
    let clock;
    let scheduler;

    let eventBusMock;
    let storageMock;

    before(() => {
        clock = sinon.useFakeTimers(Date.now());
    });

    after(() => {
        clock.restore();
    });

    beforeEach(() => {
        const eventBus = new SimpleEventSchedulerSpecEventBus();
        const storage = new SimpleEventSchedulerSpecScheduleStorage();

        eventBusMock = sinon.mock(eventBus);
        storageMock = sinon.mock(storage);

        scheduler = new SimpleEventScheduler(storage, eventBus);
    });

    afterEach(() => {
        scheduler.destroy();
    });

    it("schedules all scheduled events from storage upon initialization", () => {
        const eventBus = new SimpleEventSchedulerSpecEventBus();
        const storage = new SimpleEventSchedulerSpecScheduleStorage();

        const eventBusMock = sinon.mock(eventBus);
        const storageMock = sinon.mock(storage);

        const event = new SimpleEventSchedulerSpecEvent();
        const scheduled = [
            {
                token: "id1",
                event: event,
                timestamp: Date.now() + 500
            },
            {
                token: "id2",
                event: event,
                timestamp: Date.now() + 1000
            }
        ];

        storageMock.expects("findAll")
            .once()
            .returns(scheduled);

        storageMock.expects("remove")
            .exactly(scheduled.length);

        eventBusMock.expects("publish")
            .exactly(scheduled.length);

        new SimpleEventScheduler(storage, eventBus);
        clock.tick(1500);

        storageMock.verify();
        eventBusMock.verify();
    });

    it("schedules all scheduled events from storage only once", () => {
        const eventBus = new SimpleEventSchedulerSpecEventBus();
        const storage = new SimpleEventSchedulerSpecScheduleStorage();

        const eventBusMock = sinon.mock(eventBus);
        const storageMock = sinon.mock(storage);

        const event = new SimpleEventSchedulerSpecEvent();
        const scheduled = [
            {
                token: "id1",
                event: event,
                timestamp: Date.now() + 500
            },
            {
                token: "id1",
                event: event,
                timestamp: Date.now() + 500
            }
        ];

        storageMock.expects("findAll")
            .once()
            .returns(scheduled);

        storageMock.expects("remove")
            .once()
            .withArgs(scheduled[0].token);

        eventBusMock.expects("publish")
            .once()
            .withArgs(scheduled[0].event)
            .returns(true);

        new SimpleEventScheduler(storage, eventBus);
        clock.tick(500);

        storageMock.verify();
        eventBusMock.verify();
    });

    describe("scheduleAt", () => {
        it("schedules an event at given time", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const scheduleDate = new Date("2050-04-05 03:01:20");

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: scheduleDate.getTime()
                });

            const scheduleToken = scheduler.scheduleAt(scheduleDate, event);
            expect(scheduleToken).not.to.be.undefined;

            storageMock.verify();
        });

        it("publishes event immediately if given datetime is in the past", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const scheduleDate = new Date("1990-06-04");

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: scheduleDate.getTime()
                });

            storageMock.expects("remove")
                .once()
                .withArgs(sinon.match.string);

            eventBusMock.expects("publish")
                .once()
                .withArgs(event)
                .returns(true);

            scheduler.scheduleAt(scheduleDate, event);
            clock.tick(1);

            storageMock.verify();
            eventBusMock.verify();
        });
    });

    describe("scheduleAfter", () => {
        it("schedules event after timeout", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout
                });

            storageMock.expects("remove")
                .once()
                .withArgs(sinon.match.string);

            eventBusMock.expects("publish")
                .once()
                .withArgs(event)
                .returns(true);

            scheduler.scheduleAfter(timeout, event);
            clock.tick(timeout);

            storageMock.verify();
            eventBusMock.verify();
        });

        it("schedules event after timeout in hours", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 3600000
                });

            scheduler.scheduleAfter(timeout, event, TimeUnit.Hours);

            storageMock.verify();
        });

        it("schedules event after timeout in minutes", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 60000
                });

            scheduler.scheduleAfter(timeout, event, TimeUnit.Minutes);

            storageMock.verify();
        });

        it("schedules event after timeout in seconds", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 1000
                });

            scheduler.scheduleAfter(timeout, event, TimeUnit.Seconds);

            storageMock.verify();
        });

        it("schedules event after timeout in milliseconds", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout
                });

            scheduler.scheduleAfter(timeout, event, TimeUnit.Milliseconds);

            storageMock.verify();
        });
    });

    describe("cancelSchedule", () => {
        it("cancels a scheduled event", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            eventBusMock.expects("publish").never();

            const token = scheduler.scheduleAfter(timeout, event);

            storageMock.expects("remove")
                .once()
                .withArgs(token.getToken());

            clock.tick(300);

            scheduler.cancelSchedule(token);
            clock.tick(300);

            eventBusMock.verify();
        });

        it("is idempotent", () => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            eventBusMock.expects("publish").never();

            const token = scheduler.scheduleAfter(timeout, event);
            clock.tick(300);

            scheduler.cancelSchedule(token);
            scheduler.cancelSchedule(token);
            clock.tick(300);

            eventBusMock.verify();
        });
    });
});

class SimpleEventSchedulerSpecEvent extends Event {}

class SimpleEventSchedulerSpecScheduleStorage implements ScheduleStorage {
    public add(scheduled: ScheduledEvent): void {}
    public remove(token: string): void {}
    public findAll(): ScheduledEvent[] {
        return [];
    }
}

class SimpleEventSchedulerSpecEventBus extends EventBus {
    public subscribe(listener: EventListener, eventType?: EventType): void {}
    public unsubscribe(listener: EventListener, eventType: EventType): void {}
    public publish(event: Event): boolean {
        return true;
    }
}
