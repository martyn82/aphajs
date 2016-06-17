
import {VersionStorage} from "./Storage/VersionStorage";

export class VersionInfo {
    constructor(private _name: string, private _version: number) {}
    public get name(): string {return this._name;}
    public get version(): number {return this._version;}
}

export class VersionRepository {
    constructor(private versionStorage: VersionStorage) {}

    public findByName(name: string): VersionInfo {
        const version = this.versionStorage.findByName(name);

        if (!version) {
            return null;
        }

        return new VersionInfo(name, version);
    }

    public updateVersion(name: string, version: number): void {
        this.versionStorage.upsert(name, version);
    }
}
