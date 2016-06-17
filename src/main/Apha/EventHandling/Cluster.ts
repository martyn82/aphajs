
import {EventListener} from "./EventListener";
import {Event} from "../Message/Event";

export interface Cluster {
    getName(): string;
    getMembers(): Set<EventListener>;
    publishAll(...events: Event[]): void;
    subscribe(listener: EventListener): void;
    unsubscribe(listener: EventListener): void;
}
