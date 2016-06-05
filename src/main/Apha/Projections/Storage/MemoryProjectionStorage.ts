
import {ProjectionStorage} from "./ProjectionStorage";
import {Projection} from "../Projection";
import {ProjectionNotFoundException} from "./ProjectionNotFoundException";

export class MemoryProjectionStorage<T extends Projection> implements ProjectionStorage<T> {
    private data: {[id: string]: T} = {};

    public upsert(id: string, projection: T): void {
        this.data[id] = projection;
    }

    public remove(id: string): void {
        if (!this.data[id]) {
            return;
        }

        delete this.data[id];
    }

    public find(id: string): T {
        if (!this.data[id]) {
            throw new ProjectionNotFoundException(id);
        }

        return this.data[id];
    }

    public findAll(offset: number, limit: number): T[] {
        return Object.getOwnPropertyNames(this.data).slice(offset, offset + limit).map((id) => {
            return this.data[id];
        });
    }

    public clear(): void {
        Object.getOwnPropertyNames(this.data).forEach((id: string) => {
            delete this.data[id];
        });
    }

    public findBy(criteria: {[name: string]: string}, offset: number, limit: number): T[] {
        return Object.keys(this.data).filter((id: string) => {
            return Object.keys(criteria).every((name: string) => {
                return this.data[id][name] === criteria[name];
            });
        }).map((id: string) => {
            return this.data[id];
        });
    }
}
