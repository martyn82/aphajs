
import {EventBus} from "../EventHandling/EventBus";
import {EventStorage} from "./Storage/EventStorage";
import {Serializer} from "../Serialization/Serializer";
import {Event} from "../Message/Event";
import {ConcurrencyException} from "./ConcurrencyException";
import {EventDescriptor} from "./EventDescriptor";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {AggregateNotFoundException} from "./AggregateNotFoundException";
import {EventClassMap} from "./EventClassMap";

export class EventStore {
    private currents: {[id: string]: number} = {};

    constructor(
        private eventBus: EventBus,
        private storage: EventStorage,
        private serializer: Serializer,
        private eventClassMap: EventClassMap
    ) {
    }

    public save(aggregateId: string, aggregateType: string, events: Event[], expectedPlayhead: number): void {
        if (!this.isValidPlayhead(aggregateId, expectedPlayhead)) {
            throw new ConcurrencyException(expectedPlayhead, this.currents[aggregateId]);
        }

        let playhead = expectedPlayhead;

        events.forEach((event: Event) => {
            playhead++;
            event.version = playhead;

            this.saveEvent(aggregateId, aggregateType, event);
            this.eventBus.publish(event);
        });
    }

    private isValidPlayhead(aggregateId: string, playhead: number): boolean {
        const descriptors = this.storage.find(aggregateId);

        if (descriptors.length > 0) {
            this.currents[aggregateId] = descriptors[descriptors.length - 1].playhead;
        } else {
            this.currents[aggregateId] = -1;
        }

        return (this.currents[aggregateId] === playhead);
    }

    private saveEvent(aggregateId: string, aggregateType: string, event: Event): void {
        const descriptor = EventDescriptor.record(
            aggregateId,
            aggregateType,
            ClassNameInflector.classOf(event),
            this.serializer.serialize(event),
            event.version
        );

        this.storage.append(descriptor);
    }

    public getEventsForAggregate(aggregateId: string): Event[] {
        if (!this.storage.contains(aggregateId)) {
            throw new AggregateNotFoundException(aggregateId);
        }

        const descriptors = this.storage.find(aggregateId);

        return descriptors.map((descriptor: EventDescriptor): Event => {
            return this.serializer.deserialize(
                descriptor.payload,
                this.eventClassMap.getTypeByClassName(descriptor.event)
            );
        });
    }

    public getAggregateIds(): Set<string> {
        return this.storage.findIdentities();
    }

    public clear(): void {
        this.storage.clear();
    }
}
