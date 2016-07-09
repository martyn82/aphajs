
import {VersionStorage} from "./VersionStorage";

export class MemoryVersionStorage implements VersionStorage {
    private data: {[name: string]: number} = {};

    public async findByName(name: string): Promise<number> {
        if (!this.data[name]) {
            return null;
        }

        return this.data[name];
    }

    public async upsert(name: string, version: number): Promise<void> {
        this.data[name] = version;
    }
}
