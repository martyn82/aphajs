
import {EventBus} from "../EventHandling/EventBus";
import {EventStorage} from "./Storage/EventStorage";
import {Serializer} from "../Serialization/Serializer";
import {Event} from "../Message/Event";
import {ConcurrencyException} from "./ConcurrencyException";
import {EventDescriptor} from "./EventDescriptor";
import {AggregateNotFoundException} from "./AggregateNotFoundException";
import {EventClassMap} from "./EventClassMap";

export class EventStore {
    private currents: Map<string, number> = new Map<string, number>();

    constructor(
        private eventBus: EventBus,
        private storage: EventStorage,
        private serializer: Serializer,
        private eventClassMap: EventClassMap
    ) {
    }

    public async save(
        aggregateId: string,
        aggregateType: string,
        events: Event[],
        expectedPlayhead: number
    ): Promise<void> {
        const validPlayhead = await this.isValidPlayhead(aggregateId, expectedPlayhead);

        if (!validPlayhead) {
            throw new ConcurrencyException(expectedPlayhead, this.currents.get(aggregateId));
        }

        let playhead = expectedPlayhead;

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            playhead++;
            event.version = playhead;

            await this.saveEvent(aggregateId, aggregateType, event);
            this.eventBus.publish(event);
        }
    }

    private async isValidPlayhead(aggregateId: string, playhead: number): Promise<boolean> {
        const descriptors = await this.storage.find(aggregateId);

        if (descriptors.length > 0) {
            this.currents.set(aggregateId, descriptors[descriptors.length - 1].version);
        } else {
            this.currents.set(aggregateId, -1);
        }

        return (this.currents.get(aggregateId) === playhead);
    }

    private async saveEvent(aggregateId: string, aggregateType: string, event: Event): Promise<boolean> {
        const descriptor = EventDescriptor.record(
            aggregateId,
            aggregateType,
            event.fullyQualifiedName,
            this.serializer.serialize(event),
            event.version
        );

        return this.storage.append(descriptor);
    }

    public async getEventsForAggregate(aggregateId: string): Promise<Event[]> {
        const contains = await this.storage.contains(aggregateId);

        if (!contains) {
            throw new AggregateNotFoundException(aggregateId);
        }

        const descriptors = await this.storage.find(aggregateId);

        return descriptors.map((descriptor: EventDescriptor): Event => {
            return this.serializer.deserialize(
                descriptor.payload,
                this.eventClassMap.getTypeByClassName(descriptor.event)
            );
        });
    }

    public async getAggregateIds(): Promise<Set<string>> {
        return this.storage.findIdentities();
    }

    public async clear(): Promise<void> {
        this.currents.clear();
        return this.storage.clear();
    }
}
