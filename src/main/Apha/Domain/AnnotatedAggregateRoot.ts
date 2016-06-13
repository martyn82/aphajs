
import {AggregateRoot} from "./AggregateRoot";
import {AnnotatedCommandHandler} from "../CommandHandling/AnnotatedCommandHandler";
import {Mixin} from "../../MixinDecorator";
import {CommandHandlerDispatcher, defineDeferredCommandHandlers} from "../CommandHandling/CommandHandlerDecorator";
import {AnnotatedEventListener} from "../EventHandling/AnnotatedEventListener";
import {Command, CommandType} from "../Message/Command";
import {EventListenerDispatcher, defineDeferredEventListeners} from "../EventHandling/EventListenerDecorator";
import {Event, EventType} from "../Message/Event";

@Mixin(AnnotatedCommandHandler, AnnotatedEventListener)
export abstract class AnnotatedAggregateRoot extends AggregateRoot
    implements AnnotatedCommandHandler, AnnotatedEventListener {

    getSupportedCommands: () => CommandType[];
    getSupportedEvents: () => EventType[];

    constructor() {
        super();
        defineDeferredCommandHandlers(this);
        defineDeferredEventListeners(this);
    }

    @CommandHandlerDispatcher()
    public handle(command: Command): void {
    }

    @EventListenerDispatcher()
    public on(event: Event): void {
    }
}
