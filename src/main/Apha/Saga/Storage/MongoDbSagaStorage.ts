
import {SagaStorage} from "./SagaStorage";
import {AssociationValueDescriptor} from "./AssociationValueDescriptor";
import {Collection} from "mongodb";

export class MongoDbSagaStorage implements SagaStorage {
    constructor(private collection: Collection) {
        this.collection.createIndex({id: 1}, {unique: true});
        this.collection.createIndex({sagaClass: 1, associationValues: 1});
    }

    public async insert(
        sagaClass: string,
        id: string,
        associationValues: AssociationValueDescriptor,
        data: string
    ): Promise<void> {
        await this.collection.insertOne({
            id: id,
            sagaClass: sagaClass,
            payload: data,
            associationValues: associationValues
        });
    }

    public async update(
        sagaClass: string,
        id: string,
        associationValues: AssociationValueDescriptor,
        data: string
    ): Promise<void> {
        await this.collection.findOneAndUpdate({id: id}, {
            id: id,
            sagaClass: sagaClass,
            payload: data,
            associationValues: associationValues
        }, {upsert: true});
    }

    public async remove(id: string): Promise<void> {
        await this.collection.deleteOne({id: id});
    }

    public async findById(id: string): Promise<string> {
        const cursor = this.collection.find({id: id});

        return new Promise<string>(resolve => {
            let data = null;

            cursor.forEach(
                doc => {
                    data = doc.payload;
                },
                () => {
                    cursor.close();
                    resolve(data);
                }
            );
        });
    }

    public async find(sagaClass: string, associationValue: AssociationValueDescriptor): Promise<string[]> {
        const cursor = this.collection.find({
            sagaClass: sagaClass,
            associationValues: {
                "$in": [associationValue]
            }
        });

        return new Promise<string[]>(resolve => {
            let sagaIds = [];

            cursor.forEach(
                doc => {
                    sagaIds.push(doc.id);
                },
                () => {
                    cursor.close();
                    resolve(sagaIds);
                }
            );
        });
    }
}
