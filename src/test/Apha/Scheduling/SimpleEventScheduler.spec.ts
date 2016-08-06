
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import {expect} from "chai";
import {SimpleEventScheduler} from "../../../main/Apha/Scheduling/SimpleEventScheduler";
import {EventBus} from "../../../main/Apha/EventHandling/EventBus";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {ScheduleStorage, ScheduledEvent} from "../../../main/Apha/Scheduling/Storage/ScheduleStorage";
import {TimeUnit} from "../../../main/Apha/Scheduling/EventScheduler";

chai.use(chaiAsPromised);

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

    describe("schedule", () => {
        it("schedules all scheduled events from storage", (done) => {
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
                .returns(new Promise<ScheduledEvent[]>(resolve => resolve(scheduled)));

            storageMock.expects("remove")
                .exactly(scheduled.length)
                .returns(new Promise<void>(resolve => resolve()));

            eventBusMock.expects("publish")
                .exactly(scheduled.length)
                .returns(true);

            const scheduler = new SimpleEventScheduler(storage, eventBus);

            expect(scheduler.schedule()).to.eventually.be.fulfilled.and.satisfy(() => {
                clock.tick(1500);

                storageMock.verify();
                eventBusMock.verify();

                return true;
            }).and.notify(done);
        });

        it("schedules all scheduled events from storage only once", (done) => {
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
                .returns(new Promise<ScheduledEvent[]>(resolve => resolve(scheduled)));

            storageMock.expects("remove")
                .once()
                .withArgs(scheduled[0].token)
                .returns(new Promise<void>(resolve => resolve()));

            eventBusMock.expects("publish")
                .once()
                .withArgs(scheduled[0].event)
                .returns(true);

            const scheduler = new SimpleEventScheduler(storage, eventBus);

            expect(scheduler.schedule()).to.eventually.be.fulfilled.and.satisfy(() => {
                clock.tick(500);

                storageMock.verify();
                eventBusMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("scheduleAt", () => {
        it("schedules an event at given time", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const scheduleDate = new Date("2050-04-05 03:01:20");

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: scheduleDate.getTime()
                });

            expect(scheduler.scheduleAt(scheduleDate, event)).to.eventually.be.fulfilled.and.satisfy(scheduleToken => {
                expect(scheduleToken).not.to.be.undefined;

                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("publishes event immediately if given datetime is in the past", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const scheduleDate = new Date("1990-06-04");

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: scheduleDate.getTime()
                })
                .returns(new Promise<void>(resolve => resolve()));

            storageMock.expects("remove")
                .once()
                .withArgs(sinon.match.string)
                .returns(new Promise<void>(resolve => resolve()));

            eventBusMock.expects("publish")
                .once()
                .withArgs(event)
                .returns(true);

            expect(scheduler.scheduleAt(scheduleDate, event)).to.eventually.be.fulfilled.and.satisfy(() => {
                clock.tick(1);

                storageMock.verify();
                eventBusMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("scheduleAfter", () => {
        it("schedules event after timeout", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout
                })
                .returns(new Promise<void>(resolve => resolve()));

            storageMock.expects("remove")
                .once()
                .withArgs(sinon.match.string)
                .returns(new Promise<void>(resolve => resolve()));

            eventBusMock.expects("publish")
                .once()
                .withArgs(event)
                .returns(true);

            expect(scheduler.scheduleAfter(timeout, event)).to.eventually.be.fulfilled.and.satisfy(() => {
                clock.tick(timeout);

                storageMock.verify();
                eventBusMock.verify();
                return true;
            }).and.notify(done);
        });

        it("schedules event after timeout in hours", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 3600000
                })
                .returns(new Promise<void>(resolve => resolve()));

            expect(scheduler.scheduleAfter(timeout, event, TimeUnit.Hours)).to.eventually.be.fulfilled
                .and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("schedules event after timeout in minutes", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 60000
                })
                .returns(new Promise<void>(resolve => resolve()));

            expect(scheduler.scheduleAfter(timeout, event, TimeUnit.Minutes)).to.eventually.be.fulfilled
                .and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("schedules event after timeout in seconds", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout * 1000
                })
                .returns(new Promise<void>(resolve => resolve()));

            expect(scheduler.scheduleAfter(timeout, event, TimeUnit.Seconds)).to.eventually.be.fulfilled
                .and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("schedules event after timeout in milliseconds", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 2;

            storageMock.expects("add")
                .once()
                .withArgs({
                    token: sinon.match.string,
                    event: event,
                    timestamp: Date.now() + timeout
                })
                .returns(new Promise<void>(resolve => resolve()));

            expect(scheduler.scheduleAfter(timeout, event, TimeUnit.Milliseconds)).to.eventually.be.fulfilled
                .and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("cancelSchedule", () => {
        it("cancels a scheduled event", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            eventBusMock.expects("publish").never();

            expect(scheduler.scheduleAfter(timeout, event)).to.eventually.be.fulfilled.and.then(token => {
                storageMock.expects("remove")
                    .once()
                    .withArgs(token.getToken())
                    .returns(new Promise<void>(resolve => resolve()));

                clock.tick(300);

                expect(scheduler.cancelSchedule(token)).to.eventually.be.fulfilled.and.satisfy(() => {
                    clock.tick(300);

                    storageMock.verify();
                    eventBusMock.verify();
                    return true;
                }).and.notify(done);
            }, error => done(error));
        });

        it("is idempotent", (done) => {
            const event = new SimpleEventSchedulerSpecEvent();
            const timeout = 500;

            eventBusMock.expects("publish").never();

            expect(scheduler.scheduleAfter(timeout, event)).to.eventually.be.fulfilled.and.then(token => {
                clock.tick(300);

                expect(Promise.all([
                    expect(scheduler.cancelSchedule(token)).to.eventually.be.fulfilled,
                    expect(scheduler.cancelSchedule(token)).to.eventually.be.fulfilled
                ])).to.eventually.be.fulfilled.and.satisfy(() => {
                    clock.tick(300);

                    eventBusMock.verify();
                    return true;
                }).and.notify(done);
            }, error => done(error));
        });
    });
});

class SimpleEventSchedulerSpecEvent extends Event {}

class SimpleEventSchedulerSpecScheduleStorage implements ScheduleStorage {
    public async add(scheduled: ScheduledEvent): Promise<void> {}
    public async remove(token: string): Promise<void> {}
    public async findAll(): Promise<ScheduledEvent[]> {
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
