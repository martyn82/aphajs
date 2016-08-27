
import {AggregateRoot} from "./AggregateRoot";
import {AnnotatedCommandHandler} from "../CommandHandling/AnnotatedCommandHandler";
import {Mixin} from "ts-essentials/target/build/main/lib/mixin";
import {CommandHandlerDispatcher, defineDeferredCommandHandlers} from "../CommandHandling/CommandHandlerDecorator";
import {AnnotatedEventListener} from "../EventHandling/AnnotatedEventListener";
import {Command, CommandType} from "../Message/Command";
import {EventListenerDispatcher, defineDeferredEventListeners} from "../EventHandling/EventListenerDecorator";
import {Event, EventType} from "../Message/Event";

@Mixin(AnnotatedCommandHandler, AnnotatedEventListener)
export abstract class AnnotatedAggregateRoot extends AggregateRoot
    implements AnnotatedCommandHandler, AnnotatedEventListener {

    getSupportedCommands: () => Set<CommandType>;
    getSupportedEvents: () => Set<EventType>;

    constructor() {
        super();
        defineDeferredCommandHandlers(this);
        defineDeferredEventListeners(this);
    }

    @CommandHandlerDispatcher()
    public async handle(command: Command): Promise<void> {
    }

    @EventListenerDispatcher()
    public on(event: Event): void {
    }
}
