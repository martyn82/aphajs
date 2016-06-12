
import {AggregateRoot} from "./AggregateRoot";
import {AnnotatedCommandHandler} from "../CommandHandling/AnnotatedCommandHandler";
import {Mixin} from "../../MixinDecorator";
import {CommandHandlerDispatcher} from "../CommandHandling/CommandHandlerDecorator";
import {AnnotatedEventListener} from "../EventHandling/AnnotatedEventListener";
import {Command, CommandType} from "../Message/Command";
import {EventListenerDispatcher} from "../EventHandling/EventListenerDecorator";
import {Event, EventType} from "../Message/Event";

@Mixin(AnnotatedCommandHandler, AnnotatedEventListener)
export abstract class AnnotatedAggregateRoot extends AggregateRoot
    implements AnnotatedCommandHandler, AnnotatedEventListener {

    getSupportedCommands: () => CommandType[];
    getSupportedEvents: () => EventType[];

    @CommandHandlerDispatcher()
    public handle(command: Command): void {
    }

    @EventListenerDispatcher()
    public on(event: Event): void {
    }
}
