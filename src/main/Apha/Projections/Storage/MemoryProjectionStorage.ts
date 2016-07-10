
import {ProjectionStorage} from "./ProjectionStorage";
import {Projection} from "../Projection";
import {ProjectionNotFoundException} from "./ProjectionNotFoundException";

export class MemoryProjectionStorage<T extends Projection> implements ProjectionStorage<T> {
    private data: {[id: string]: T} = {};

    public async upsert(id: string, projection: T): Promise<void> {
        this.data[id] = projection;
    }

    public async remove(id: string): Promise<void> {
        if (!this.data[id]) {
            return;
        }

        delete this.data[id];
    }

    public async find(id: string): Promise<T> {
        if (!this.data[id]) {
            throw new ProjectionNotFoundException(id);
        }

        return this.data[id];
    }

    public async findAll(offset: number, limit: number): Promise<T[]> {
        return Object.getOwnPropertyNames(this.data).slice(offset, offset + limit).map((id) => {
            return this.data[id];
        });
    }

    public async clear(): Promise<void> {
        Object.getOwnPropertyNames(this.data).forEach((id: string) => {
            delete this.data[id];
        });
    }

    public async findBy(criteria: {[name: string]: string}, offset: number, limit: number): Promise<T[]> {
        return Object.keys(this.data).filter((id: string) => {
            return Object.keys(criteria).every((name: string) => {
                return this.data[id][name] === criteria[name];
            });
        }).map((id: string) => {
            return this.data[id];
        });
    }
}
