
import {AggregateRoot} from "../../Apha/Domain/AggregateRoot";

export interface Repository<T extends AggregateRoot> {
    findById(id: string): T;
    store(aggregate: AggregateRoot, expectedPlayhead: number): void;
}
