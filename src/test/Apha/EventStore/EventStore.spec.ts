
import * as sinon from "sinon";
import {expect} from "chai";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {EventBus} from "../../../main/Apha/EventHandling/EventBus";
import {EventStorage} from "../../../main/Apha/EventStore/Storage/EventStorage";
import {Serializer} from "../../../main/Apha/Serialization/Serializer";
import {EventDescriptor} from "../../../main/Apha/EventStore/EventDescriptor";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {ClassNameInflector} from "../../../main/Apha/Inflection/ClassNameInflector";
import {AggregateNotFoundException} from "../../../main/Apha/EventStore/AggregateNotFoundException";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {ConcurrencyException} from "../../../main/Apha/EventStore/ConcurrencyException";
import {AnyType} from "../../../main/Inflect";

describe("EventStore", () => {
    let eventStore;
    let serializer;

    let eventBusMock;
    let storageMock;
    let serializerMock;

    beforeEach(() => {
        const eventBus = new EventStoreEventBus();
        const storage = new EventStoreEventStorage();
        serializer = new EventStoreSerializer();

        eventBusMock = sinon.mock(eventBus);
        storageMock = sinon.mock(storage);
        serializerMock = sinon.mock(serializer);

        eventStore = new EventStore(eventBus, storage, serializer, new EventClassMap([EventStoreEvent]));
    });

    describe("getAggregateIds", () => {
        it("retrieves all IDs for all stored aggregates", () => {
            storageMock.expects("findIdentities").once();
            eventStore.getAggregateIds();

            storageMock.verify();
        });
    });

    describe("getEventsForAggregate", () => {
        it("retrieves all events for aggregate with given ID", () => {
            const aggregateId = "id";
            const event = new EventStoreEvent();
            const descriptors = [
                EventDescriptor.record(
                    aggregateId,
                    "aggregatetype",
                    ClassNameInflector.className(EventStoreEvent),
                    serializer.serialize(event),
                    1
                )
            ];

            storageMock.expects("contains")
                .once()
                .withArgs(aggregateId)
                .returns(true);

            storageMock.expects("find")
                .once()
                .withArgs(aggregateId)
                .returns(descriptors);

            serializerMock.expects("deserialize")
                .once()
                .returns(event);

            const events = eventStore.getEventsForAggregate(aggregateId);

            expect(events).to.have.lengthOf(1);
            expect(events[0]).to.be.an.instanceOf(EventStoreEvent);

            storageMock.verify();
            storageMock.restore();
        });

        it("throws exception if aggregate cannot be found", () => {
            const aggregateId = "id";

            storageMock.expects("contains")
                .once()
                .withArgs(aggregateId)
                .returns(false);

            expect(() => {
                eventStore.getEventsForAggregate(aggregateId);
            }).to.throw(AggregateNotFoundException);
        });
    });

    describe("save", () => {
        it("stores a series of events for a new aggregate to storage", () => {
            const aggregateId = "id";
            const aggregateType = "aggregatetype";
            const events = [
                new EventStoreEvent(),
                new EventStoreEvent()
            ];

            storageMock.expects("find")
                .once()
                .withArgs(aggregateId)
                .returns([]);

            storageMock.expects("append")
                .exactly(events.length);

            eventStore.save(aggregateId, aggregateType, events, -1);
        });

        it("stores a series of events for an existing aggregate to storage", () => {
            const aggregateId = "id";
            const aggregateType = "aggregatetype";

            const firstEvent = new EventStoreEvent();
            firstEvent.version = 1;
            const secondEvent = new EventStoreEvent();
            secondEvent.version = 2;

            const history = [firstEvent, secondEvent];
            const events = [
                new EventStoreEvent(),
                new EventStoreEvent()
            ];

            storageMock.expects("find")
                .once()
                .withArgs(aggregateId)
                .returns(
                    history.map((event: Event) => {
                        return EventDescriptor.record(
                            aggregateId,
                            aggregateType,
                            ClassNameInflector.classOf(event),
                            serializer.serialize(event),
                            event.version
                        );
                    }
                ));

            storageMock.expects("append")
                .exactly(events.length);

            eventStore.save(aggregateId, aggregateType, events, 2);
        });

        it("throws exception if expected playhead is invalid", () => {
            const aggregateId = "id";
            const aggregateType = "aggregatetype";

            storageMock.expects("find")
                .once()
                .withArgs(aggregateId)
                .returns([]);

            expect(() => {
                eventStore.save(aggregateId, aggregateType, [], 1);
            }).to.throw(ConcurrencyException);
        });
    });

    describe("clear", () => {
        it("should clear the storage", () => {
            storageMock.expects("clear")
                .once();

            eventStore.clear();

            storageMock.verify();
        });
    });
});

class EventStoreEvent extends Event {
}

class EventStoreEventStorage implements EventStorage {
    public contains(id: string): boolean {
        return false;
    }

    public append(event: EventDescriptor): boolean {
        return false;
    }

    public find(id: string): EventDescriptor[] {
        return [];
    }

    public findIdentities(): Set<string> {
        return new Set<string>();
    }

    public clear(): void {
    }
}

class EventStoreSerializer implements Serializer {
    public serialize(value: any): string {
        return "";
    }

    public deserialize(data: string, type: AnyType): any {
        return null;
    }
}

class EventStoreEventBus extends EventBus {
    public subscribe(listener: EventListener, eventType?: EventType): void {
    }

    public unsubscribe(listener: EventListener, eventType: EventType): void {
    }

    public publish(event: Event): boolean {
        return false;
    }
}
