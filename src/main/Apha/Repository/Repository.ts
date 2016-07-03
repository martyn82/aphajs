
import {AggregateRoot} from "../../Apha/Domain/AggregateRoot";

export interface Repository<T extends AggregateRoot> {
    findById(id: string): Promise<T>;
    store(aggregate: AggregateRoot, expectedVersion: number): Promise<void>;
}
