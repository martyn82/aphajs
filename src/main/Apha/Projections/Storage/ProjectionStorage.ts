
import {Projection} from "../Projection";

export interface ProjectionStorage {
    upsert(id: string, projection: Projection): void;
    delete(id: string): void;
    find(id: string): Projection;
    findAll(offset: number, limit: number): Projection[];
    clear(): void;
    findBy(criteria: {}, offset: number, limit: number): Projection[];
}
