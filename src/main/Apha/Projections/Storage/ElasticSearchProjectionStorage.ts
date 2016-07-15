
import * as ElasticSearch from "elasticsearch";
import {ProjectionStorage} from "./ProjectionStorage";
import {Projection, ProjectionType} from "../Projection";
import {ProjectionNotFoundException} from "./ProjectionNotFoundException";

export class ElasticSearchProjectionStorage<T extends Projection> implements ProjectionStorage<T> {
    constructor(
        private client: ElasticSearch.Client,
        private index: string,
        private type: string,
        private projectionType: ProjectionType
    ) {
    }

    public async upsert(id: string, projection: T): Promise<void> {
        await this.client.update({
            index: this.index,
            type: this.type,
            id: id,
            body: {
                doc: projection,
                doc_as_upsert: true
            }
        });
    }

    public async remove(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.delete({
                index: this.index,
                type: this.type,
                id: id
            }).then(() => resolve(), error => {
                if (error.status === 404) {
                    resolve();
                    return;
                }

                reject();
            });
        });
    }

    public async find(id: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.client.get({
                index: this.index,
                type: this.type,
                id: id
            }).then(response => {
                if (!response.found) {
                    reject(new ProjectionNotFoundException(id));
                    return;
                }

                const projection = Reflect.construct(this.projectionType, []);
                resolve(projection.copy(response._source));
            }, error => {
                if (error.status === 404) {
                    reject(new ProjectionNotFoundException(id));
                    return;
                }

                reject();
            });
        });
    }

    public async findAll(offset: number, limit: number): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            this.client.search({
                index: this.index,
                type: this.type,
                body: {
                    from: offset,
                    size: limit,
                    query: {
                        match_all: {}
                    }
                }
            }).then(response => {
                const projections = [];

                response.hits.hits.forEach(doc => {
                    const projection = Reflect.construct(this.projectionType, []);
                    projections.push(projection.copy(doc._source));
                });

                resolve(projections);
            }, () => reject());
        });
    }

    public async clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.indices.delete({
                index: this.index
            }).then(() => {
                this.client.indices.create({
                    index: this.index
                }).then(() => resolve(), () => reject());
            }, () => reject());
        });
    }

    public async findBy(criteria: {}, offset: number, limit: number): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const query = {
                must: []
            };

            for (const field in criteria) {
                if (criteria.hasOwnProperty(field)) {
                    const match = {};
                    match[field] = criteria[field];
                    query.must.push({match: match});
                }
            }

            this.client.search({
                index: this.index,
                type: this.type,
                body: {
                    from: offset,
                    size: limit,
                    query: {
                        bool: query
                    }
                }
            }).then(response => {
                const projections = [];

                response.hits.hits.forEach(doc => {
                    const projection = Reflect.construct(this.projectionType, []);
                    projections.push(projection.copy(doc._source));
                });

                resolve(projections);
            }, () => reject());
        });
    }
}
