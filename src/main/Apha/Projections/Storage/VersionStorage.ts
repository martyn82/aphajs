
export interface VersionStorage {
    findByName(name: string): Promise<number>;
    upsert(name: string, version: number): Promise<void>;
}
