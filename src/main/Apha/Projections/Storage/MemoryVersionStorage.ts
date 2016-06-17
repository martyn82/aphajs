
import {VersionStorage} from "./VersionStorage";

export class MemoryVersionStorage implements VersionStorage {
    private data: {[name: string]: number} = {};

    public findByName(name: string): number {
        if (!this.data[name]) {
            return null;
        }

        return this.data[name];
    }

    public upsert(name: string, version: number): void {
        this.data[name] = version;
    }
}
