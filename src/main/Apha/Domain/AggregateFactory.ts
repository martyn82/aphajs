
import {AggregateRoot} from "./AggregateRoot";
import {Event} from "../Message/Event";

export interface AggregateFactory<T extends AggregateRoot> {
    createAggregate(events: Event[]): T;
    getAggregateType(): string;
}
