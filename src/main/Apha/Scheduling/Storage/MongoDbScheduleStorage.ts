
import {ScheduleStorage, ScheduledEvent} from "./ScheduleStorage";
import {Collection} from "mongodb";
import {Serializer} from "../../Serialization/Serializer";
import {EventClassMap} from "../../EventStore/EventClassMap";

export class MongoDbScheduleStorage implements ScheduleStorage {
    constructor(private collection: Collection, private serializer: Serializer, private eventClassMap: EventClassMap) {
        this.collection.createIndex({token: 1}, {unique: true});
    }

    public async add(schedule: ScheduledEvent): Promise<void> {
        await this.collection.insertOne({
            token: schedule.token,
            timestamp: schedule.timestamp,
            event: this.serializer.serialize(schedule.event),
            eventType: schedule.event.fullyQualifiedName
        });
    }

    public async remove(id: string): Promise<void> {
        await this.collection.deleteOne({token: id});
    }

    public async findAll(): Promise<ScheduledEvent[]> {
        const cursor = await this.collection.find();

        return new Promise<ScheduledEvent[]>(resolve => {
            const schedule = [];

            cursor.forEach(
                doc => {
                    const event = this.serializer.deserialize(
                        doc.event,
                        this.eventClassMap.getTypeByClassName(doc.eventType)
                    );

                    schedule.push({
                        event: event,
                        timestamp: doc.timestamp,
                        token: doc.token
                    });
                },
                () => {
                    cursor.close();
                    resolve(schedule);
                }
            );
        });
    }
}
