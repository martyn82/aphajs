
import {Event} from "../Message/Event";
import {Command} from "../Message/Command";
import {AggregateRoot} from "../Domain/AggregateRoot";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {AggregateFactory} from "../Domain/AggregateFactory";
import {TraceableEventStore} from "./TraceableEventStore";
import {CommandHandler} from "../CommandHandling/CommandHandler";

export class Scenario {
    private aggregate: AggregateRoot;

    constructor(
        private aggregateFactory: AggregateFactory<AggregateRoot>,
        private eventStore: TraceableEventStore,
        private commandHandler: CommandHandler,
        private assert: (expectedEvents: Event[], actualEvents: Event[]) => void
    ) {}

    public given(...events: Event[]): this {
        if (events.length === 0) {
            return this;
        }

        const aggregate = this.getAggregate(events);
        this.eventStore.save(aggregate.getId(), ClassNameInflector.classOf(aggregate), events, -1);

        return this;
    }

    public when(...commands: Command[]): this {
        this.eventStore.clearTraceLog();

        if (commands.length === 0) {
            return this;
        }

        commands.forEach((command: Command) => {
            this.commandHandler.handle(command);
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
