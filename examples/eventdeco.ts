
import "reflect-metadata";
import {Event} from "../src/main/Apha/Message/Event";

export type AnnotatedEvents = {};

export function DomainEvent(): Function {
    return (target: Event): void => {

    };
}

@DomainEvent()
class SomeEvent extends Event {
}
