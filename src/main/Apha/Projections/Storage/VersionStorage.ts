
export interface VersionStorage {
    findByName(name: string): number;
    upsert(name: string, version: number): void;
}
