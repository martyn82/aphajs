
import {EventStore} from "../EventStore/EventStore";
import {Cluster} from "../EventHandling/Cluster";
import {Event} from "../Message/Event";
import {EventListener} from "../EventHandling/EventListener";

export class ReplayingCluster implements Cluster {
    constructor(private cluster: Cluster, private eventStore: EventStore) {}

    public startReplay(): void {
        this.eventStore.getAggregateIds().forEach(aggregateId => {
            this.publishAll.apply(this, this.eventStore.getEventsForAggregate(aggregateId));
        });
    }

    public getName(): string {
        return this.cluster.getName();
    }

    public publishAll(...events: Event[]): void {
        this.cluster.publishAll.apply(this.cluster, events);
    }

    public getMembers(): Set<EventListener> {
        return this.cluster.getMembers();
    }

    public subscribe(listener: EventListener): void {
        this.cluster.subscribe(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.cluster.unsubscribe(listener);
    }
}
