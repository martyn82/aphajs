
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {EventSourcingRepository} from "../../../main/Apha/Repository/EventSourcingRepository";
import {AggregateFactory} from "../../../main/Apha/Domain/AggregateFactory";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {EventStorage} from "../../../main/Apha/EventStore/Storage/EventStorage";
import {EventDescriptor} from "../../../main/Apha/EventStore/EventDescriptor";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";

chai.use(chaiAsPromised);

describe("EventSourcingRepository", () => {
    let repository;

    let factoryMock;
    let eventStoreMock;

    beforeEach(() => {
        const eventBus = new SimpleEventBus();
        const storage = new EventSourcingRepositoryEventStorage();
        const serializer = new JsonSerializer();
        const events = new Set<EventType>();
        events.add(EventSourcingRepositoryEvent);
        const eventClassMap = new EventClassMap(events);

        const factory = new EventSourcingRepositoryAggregateFactory();
        const eventStore = new EventStore(eventBus, storage, serializer, eventClassMap);

        factoryMock = sinon.mock(factory);
        eventStoreMock = sinon.mock(eventStore);

        repository = new EventSourcingRepository(factory, eventStore);
    });

    describe("findById", () => {
        it("retrieves aggregate by ID", (done) => {
            const aggregateId = "id";
            const events = [
                new EventSourcingRepositoryEvent()
            ];
            const aggregate = new EventSourcingRepositoryAggregateRoot();
            const promisedEvents = new Promise<Event[]>(resolve => resolve(events));

            eventStoreMock.expects("getEventsForAggregate")
                .once()
                .withArgs(aggregateId)
                .returns(promisedEvents);

            factoryMock.expects("createAggregate")
                .once()
                .withArgs()
                .returns(aggregate);

            expect(repository.findById(aggregateId)).to.eventually.be
                .an.instanceOf(EventSourcingRepositoryAggregateRoot)
                .and.satisfy(() => {
                    eventStoreMock.verify();
                    factoryMock.verify();
                    return true;
                }).and.notify(done);
        });
    });

    describe("store", () => {
        it("saves not yet committed changes of an aggregate", (done) => {
            const expectedPlayhead = -1;
            const aggregateId = "id";

            const changes = [
                new EventSourcingRepositoryEvent()
            ];

            const aggregate = new EventSourcingRepositoryAggregateRoot();
            const aggregateMock = sinon.mock(aggregate);

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

            expect(repository.store(aggregate, expectedPlayhead)).to.eventually.be.fulfilled.and.satisfy(() => {
                aggregateMock.verify();
                eventStoreMock.verify();
                return true;
            }).and.notify(done);
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
    public async contains(id: string): Promise<boolean> {
        return false;
    }
    public async append(event: EventDescriptor): Promise<boolean> {
        return false;
    }
    public async find(id: string): Promise<EventDescriptor[]> {
        return [];
    }
    public async findIdentities(): Promise<Set<string>> {
        return new Set<string>();
    }
    public async clear(): Promise<void> {
    }
}

class EventSourcingRepositoryEvent extends Event {}
