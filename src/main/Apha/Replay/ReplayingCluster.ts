
import {EventStore} from "../EventStore/EventStore";
import {Cluster} from "../EventHandling/Cluster";
import {Event} from "../Message/Event";
import {EventListener} from "../EventHandling/EventListener";

export class ReplayingCluster implements Cluster {
    constructor(private delegate: Cluster, private eventStore: EventStore) {}

    public async startReplay(): Promise<void> {
        const aggregateIds = await this.eventStore.getAggregateIds();

        for (const aggregateId of aggregateIds.values()) {
            const events = await this.eventStore.getEventsForAggregate(aggregateId);
            this.publishAll.apply(this, events);
        }
    }

    public getName(): string {
        return this.delegate.getName();
    }

    public publishAll(...events: Event[]): void {
        this.delegate.publishAll.apply(this.delegate, events);
    }

    public getMembers(): Set<EventListener> {
        return this.delegate.getMembers();
    }

    public subscribe(listener: EventListener): void {
        this.delegate.subscribe(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.delegate.unsubscribe(listener);
    }
}
