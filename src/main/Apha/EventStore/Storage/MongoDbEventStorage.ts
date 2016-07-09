
import {EventStorage} from "./EventStorage";
import {EventDescriptor} from "../EventDescriptor";
import {Collection} from "mongodb";

export class MongoDbEventStorage implements EventStorage {
    constructor(private collection: Collection) {
        this.collection.createIndex({id: 1});
        this.collection.createIndex({id: 1, type: 1});
    }

    public async contains(id: string): Promise<boolean> {
        const count = await this.collection.count({"id": id});
        return count > 0;
    }

    public async append(event: EventDescriptor): Promise<boolean> {
        const result = await this.collection.insertOne(event);
        return result.insertedCount === 1;
    }

    public async find(id: string): Promise<EventDescriptor[]> {
        return new Promise<EventDescriptor[]>(resolve => {
            const cursor = this.collection.find({"id": id});
            const events = [];

            cursor.forEach(
                doc => {
                    events.push(doc);
                },
                () => {
                    resolve(events);
                }
            );
        });
    }

    public async findIdentities(): Promise<Set<string>> {
        return new Promise<Set<string>>(resolve => {
            const cursor = this.collection.find();
            const ids = new Set<string>();

            cursor.forEach(
                doc => {
                    ids.add(doc.id);
                },
                () => {
                    resolve(ids);
                }
            );
        });
    }

    public async clear(): Promise<void> {
    }
}
