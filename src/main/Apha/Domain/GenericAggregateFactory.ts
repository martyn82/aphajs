
import {AggregateFactory} from "./AggregateFactory";
import {Event} from "../Message/Event";
import {AggregateRoot, AggregateRootType} from "./AggregateRoot";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class GenericAggregateFactory<T extends AggregateRoot> implements AggregateFactory<T> {
    private aggregateType: string;

    constructor(private aggregateRootType: AggregateRootType<T>) {
        this.aggregateType = ClassNameInflector.className(this.aggregateRootType);
    }

    public createAggregate(events: Event[]): T {
        let instance = new this.aggregateRootType();
        instance.loadFromHistory(events);
        return instance;
    }

    public getAggregateType(): string {
        return this.aggregateType;
    }
}
