
import {Projection} from "../Projection";

export interface ProjectionStorage<T extends Projection> {
    upsert(id: string, projection: T): void;
    remove(id: string): void;
    find(id: string): T;
    findAll(offset: number, limit: number): T[];
    clear(): void;
    findBy(criteria: {}, offset: number, limit: number): T[];
}
