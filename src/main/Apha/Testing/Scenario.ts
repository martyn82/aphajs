
import {Event} from "../Message/Event";
import {Command} from "../Message/Command";
import {AggregateRoot} from "../Domain/AggregateRoot";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {AggregateFactory} from "../Domain/AggregateFactory";
import {TraceableEventStore} from "./TraceableEventStore";
import {CommandBus} from "../CommandHandling/CommandBus";
import {AssertEvents} from "./Assert";

export class Scenario {
    private aggregate: AggregateRoot;

    constructor(
        private aggregateFactory: AggregateFactory<AggregateRoot>,
        private eventStore: TraceableEventStore,
        private commandBus: CommandBus,
        private assert: AssertEvents
    ) {}

    public given(...events: Event[]): this {
        this.eventStore.clear();

        if (events.length === 0) {
            return this;
        }

        events.forEach(event => {
            event.version = -1;
        });

        const aggregate = this.getAggregate(events);
        this.eventStore.save(aggregate.getId(), ClassNameInflector.classOf(aggregate), events, aggregate.version);

        return this;
    }

    public when(...commands: Command[]): this {
        this.eventStore.clearTraceLog();

        if (commands.length === 0) {
            return this;
        }

        commands.forEach((command: Command) => {
            this.commandBus.send(command);
        });

        return this;
    }

    public then(...expectedEvents: Event[]): void {
        const actualEvents = this.eventStore.getEvents();

        expectedEvents.forEach((event: Event, index: number) => {
            if (actualEvents[index]) {
                event.version = actualEvents[index].version;
            }
        });

        this.assert(expectedEvents, actualEvents);
    }

    private getAggregate(events: Event[]): AggregateRoot {
        if (!this.aggregate) {
            this.aggregate = this.aggregateFactory.createAggregate(events);
        }

        return this.aggregate;
    }
}
