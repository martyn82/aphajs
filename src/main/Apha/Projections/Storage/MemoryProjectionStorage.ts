
import {ProjectionStorage} from "./ProjectionStorage";
import {Projection} from "../Projection";
import {ProjectionNotFoundException} from "./ProjectionNotFoundException";

export class MemoryProjectionStorage implements ProjectionStorage {
    private data: {[id: string]: Projection} = {};

    public upsert(id: string, projection: Projection): void {
        this.data[id] = projection;
    }

    public delete(id: string): void {
        if (!this.data[id]) {
            return;
        }

        delete this.data[id];
    }

    public find(id: string): Projection {
        if (!this.data[id]) {
            throw new ProjectionNotFoundException(id);
        }
        
        return this.data[id];
    }

    public findAll(offset: number, limit: number): Projection[] {
        return Object.getOwnPropertyNames(this.data).slice(offset, offset + limit).map((id) => {
            return this.data[id];
        });
    }

    public clear(): void {
        Object.getOwnPropertyNames(this.data).forEach((id: string) => {
            delete this.data[id];
        });
    }

    public findBy(criteria: {[name: string]: string}, offset: number, limit: number): Projection[] {
        return Object.keys(this.data).filter((id: string) => {
            return Object.keys(criteria).every((name: string) => {
                return this.data[id][name] === criteria[name];
            });
        }).map((id: string) => {
            return this.data[id];
        });
    }
}
