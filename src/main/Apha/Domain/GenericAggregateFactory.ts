
import {AggregateFactory} from "./AggregateFactory";
import {Event} from "../Message/Event";
import {AggregateRoot} from "./AggregateRoot";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class GenericAggregateFactory<T extends AggregateRoot> implements AggregateFactory<T> {
    private aggregateType: string;

    constructor(private ctor: {new(...args: any[]): T}) {
        this.aggregateType = ClassNameInflector.className(this.ctor);
    }

    public createAggregate(events: Event[]): T {
        let instance = new this.ctor();
        instance.loadFromHistory(events);
        return instance;
    }

    public getAggregateType(): string {
        return this.aggregateType;
    }
}
