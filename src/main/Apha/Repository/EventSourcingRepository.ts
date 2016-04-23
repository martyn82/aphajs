
import {Repository} from "./Repository";
import {AggregateRoot} from "../Domain/AggregateRoot";
import {AggregateFactory} from "../Domain/AggregateFactory";
import {EventStore} from "../EventStore/EventStore";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class EventSourcingRepository<T extends AggregateRoot> implements Repository<T> {
    constructor(private factory: AggregateFactory<T>, private eventStore: EventStore) {}

    public findById(id: string): T {
        let events = this.eventStore.getEventsForAggregate(id);
        return this.factory.createAggregate(events);
    }

    public store(aggregate: AggregateRoot, expectedPlayhead: number): void {
        this.eventStore.save(
            aggregate.getId(),
            ClassNameInflector.classOf(aggregate),
            aggregate.getUncommittedChanges(),
            expectedPlayhead
        );

        aggregate.markChangesCommitted();
    }
}
