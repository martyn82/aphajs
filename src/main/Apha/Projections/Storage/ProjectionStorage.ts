
import {Projection} from "../Projection";

export interface ProjectionStorage<T extends Projection> {
    upsert(id: string, projection: T): Promise<void>;
    remove(id: string): Promise<void>;
    find(id: string): Promise<T>;
    findAll(offset: number, limit: number): Promise<T[]>;
    clear(): Promise<void>;
    findBy(criteria: {}, offset: number, limit: number): Promise<T[]>;
}
