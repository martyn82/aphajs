
import {VersionStorage} from "./VersionStorage";
import {Collection} from "mongodb";

export class MongoDbVersionStorage implements VersionStorage {
    constructor(private collection: Collection) {
        this.collection.createIndex({name: 1});
    }

    public async findByName(name: string): Promise<number> {
        return new Promise<number>(resolve => {
            const cursor = this.collection.find({name: name});
            let version = null;

            cursor.forEach(
                doc => {
                    version = doc.version;
                },
                () => {
                    cursor.close();
                    resolve(version);
                }
            );
        });
    }

    public async upsert(name: string, version: number): Promise<void> {
        await this.collection.findOneAndUpdate(
            {name: name},
            {name: name, version: version},
            {upsert: true}
        );
        return;
    }
}
