
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
    private events: Event[];
    private commands: Command[];

    constructor(
        private aggregateFactory: AggregateFactory<AggregateRoot>,
        private eventStore: TraceableEventStore,
        private commandBus: CommandBus,
        private assert: AssertEvents
    ) {}

    public given(...events: Event[]): this {
        this.aggregate = null;
        this.events = [];

        if (events.length === 0) {
            return this;
        }

        events.forEach(event => {
            event.version = -1;
            this.events.push(event);
        });

        return this;
    }

    public when(...commands: Command[]): this {
        this.commands = [];

        if (commands.length === 0) {
            return this;
        }

        commands.forEach(command => this.commands.push(command));
        return this;
    }

    public async then(...expectedEvents: Event[]): Promise<void> {
        await this.arrange();
        await this.act();

        const actualEvents = this.eventStore.getEvents();

        expectedEvents.forEach((event: Event, index: number) => {
            if (actualEvents[index]) {
                event.version = actualEvents[index].version;
            }
        });

        this.assert(expectedEvents, actualEvents);
    }

    private async arrange(): Promise<void> {
        this.eventStore.clear();

        const aggregate = this.getAggregate(this.events);

        await this.eventStore.save(
            aggregate.getId(),
            ClassNameInflector.classOf(aggregate),
            this.events,
            aggregate.version
        );

        this.events = [];
    }

    private async act(): Promise<void> {
        this.eventStore.clearTraceLog();

        for (let i = 0; i < this.commands.length; i++) {
            const command = this.commands[i];
            await this.commandBus.send(command);
        }

        this.commands = [];
    }

    private getAggregate(events: Event[]): AggregateRoot {
        if (!this.aggregate) {
            this.aggregate = this.aggregateFactory.createAggregate(events);
        }

        return this.aggregate;
    }
}
