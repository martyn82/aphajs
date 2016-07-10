
import {ProjectionStorage} from "./ProjectionStorage";
import {Projection, ProjectionType} from "../Projection";
import {Collection} from "mongodb";
import {ProjectionNotFoundException} from "./ProjectionNotFoundException";

export class MongoDbProjectionStorage<T extends Projection> implements ProjectionStorage<T> {
    constructor(private collection: Collection, private projectionType: ProjectionType) {
        this.collection.createIndex({__id: 1}, {unique: true});
    }

    public async upsert(id: string, projection: T): Promise<void> {
        const document = projection.copy();
        document["__id"] = id;
        await this.collection.findOneAndReplace({__id: id}, document, {upsert: true});
    }

    public async remove(id: string): Promise<void> {
        await this.collection.deleteOne({__id: id});
    }

    public async find(id: string): Promise<T> {
        const cursor = await this.collection.find({__id: id});
        return new Promise<T>((resolve, reject) => {
            let projection = null;

            cursor.forEach(
                doc => {
                    projection = Reflect.construct(this.projectionType, []).copy(doc);
                },
                () => {
                    cursor.close();

                    if (projection) {
                        resolve(projection);
                    } else {
                        reject(new ProjectionNotFoundException(id));
                    }
                }
            );
        });
    }

    public async findAll(offset: number, limit: number): Promise<T[]> {
        const cursor = await this.collection.find().skip(offset).limit(limit);
        return new Promise<T[]>(resolve => {
            let projections = [];

            cursor.forEach(
                doc => {
                    projections.push(
                        Reflect.construct(this.projectionType, []).copy(doc)
                    );
                },
                () => {
                    cursor.close();
                    resolve(projections);
                }
            );
        });
    }

    public async clear(): Promise<void> {
        return this.collection.drop();
    }

    public async findBy(criteria: {}, offset: number, limit: number): Promise<T[]> {
        const cursor = await this.collection.find(criteria).skip(offset).limit(limit);
        return new Promise<T[]>(resolve => {
            let projections = [];

            cursor.forEach(
                doc => {
                    projections.push(
                        Reflect.construct(this.projectionType, []).copy(doc)
                    );
                },
                () => {
                    cursor.close();
                    resolve(projections);
                }
            );
        });
    }
}
