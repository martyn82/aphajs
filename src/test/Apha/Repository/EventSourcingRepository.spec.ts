
import {expect} from "chai";
import {EventSourcingRepository} from "../../../main/Apha/Repository/EventSourcingRepository";
import {AggregateFactory} from "../../../main/Apha/Domain/AggregateFactory";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Event} from "../../../main/Apha/Message/Event";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {EventStorage} from "../../../main/Apha/EventStore/Storage/EventStorage";
import {EventDescriptor} from "../../../main/Apha/EventStore/EventDescriptor";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";

describe("EventSourcingRepository", () => {
    let repository;

    let factoryMock;
    let eventStoreMock;

    beforeEach(() => {
        let eventBus = new SimpleEventBus();
        let storage = new EventSourcingRepositoryEventStorage();
        let serializer = new JsonSerializer();
        let eventClassMap = new EventClassMap([EventSourcingRepositoryEvent]);

        let factory = new EventSourcingRepositoryAggregateFactory();
        let eventStore = new EventStore(eventBus, storage, serializer, eventClassMap);

        factoryMock = sinon.mock(factory);
        eventStoreMock = sinon.mock(eventStore);

        repository = new EventSourcingRepository(factory, eventStore);
    });

    describe("findById", () => {
        it("retrieves aggregate by ID", () => {
            let aggregateId = "id";
            let events = [
                new EventSourcingRepositoryEvent()
            ];
            let aggregate = new EventSourcingRepositoryAggregateRoot();

            eventStoreMock.expects("getEventsForAggregate")
                .once()
                .withArgs(aggregateId)
                .returns(events);

            factoryMock.expects("createAggregate")
                .once()
                .withArgs()
                .returns(aggregate);

            let actual = repository.findById(aggregateId);
            expect(actual).to.be.an.instanceOf(EventSourcingRepositoryAggregateRoot);
        });
    });

    describe("store", () => {
        it("saves not yet committed changes of an aggregate", () => {
            let expectedPlayhead = -1;
            let aggregateId = "id";

            let changes = [
                new EventSourcingRepositoryEvent()
            ];

            let aggregate = new EventSourcingRepositoryAggregateRoot();
            let aggregateMock = sinon.mock(aggregate);

            aggregateMock.expects("getId")
                .once()
                .returns(aggregateId);

            aggregateMock.expects("getUncommittedChanges")
                .once()
                .returns(changes);

            aggregateMock.expects("markChangesCommitted")
                .once();

            eventStoreMock.expects("save")
                .once()
                .withArgs(
                    aggregateId,
                    "EventSourcingRepositoryAggregateRoot",
                    changes,
                    expectedPlayhead
                );

            repository.store(aggregate, expectedPlayhead);
        });
    });
});

class EventSourcingRepositoryAggregateRoot extends AggregateRoot {
    public getId(): string {
        return "";
    }
}

class EventSourcingRepositoryAggregateFactory<T extends AggregateRoot> implements AggregateFactory<T> {
    public createAggregate(events: Event[]): T {
        return null;
    }

    public getAggregateType(): string {
        return "";
    }
}

class EventSourcingRepositoryEventStorage implements EventStorage {
    public contains(id: string): boolean {
        return false;
    }
    public append(event: EventDescriptor): boolean {
        return false;
    }
    public find(id: string): EventDescriptor[] {
        return [];
    }
    public findIdentities(): string[] {
        return [];
    }
}

class EventSourcingRepositoryEvent extends Event {}
