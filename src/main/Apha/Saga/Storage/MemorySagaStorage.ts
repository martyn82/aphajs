
import {SagaStorage} from "./SagaStorage";
import {AssociationValueDescriptor} from "./AssociationValueDescriptor";

type SagaDescriptor = {
    className: string,
    id: string,
    associations: AssociationValueDescriptor,
    serializedSaga: string
};

type SagaMap = {[id: string]: SagaDescriptor};
type AssociationMap = {[field: string]: {[value: string]: string[]}};

export class MemorySagaStorage implements SagaStorage {
    private sagas: SagaMap = {};
    private associations: AssociationMap = {};

    public async insert(
        sagaClass: string,
        id: string,
        associationValues: AssociationValueDescriptor,
        data: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.sagas[id]) {
                reject();
                return;
            }

            this.sagas[id] = {
                className: sagaClass,
                id: id,
                associations: associationValues,
                serializedSaga: data
            };

            this.associateSaga(id, associationValues);
            resolve();
        });
    }

    private associateSaga(id: string, associationValues: AssociationValueDescriptor): void {
        for (const field in associationValues) {
            const value = associationValues[field];

            if (!this.associations[field]) {
                this.associations[field] = {};
            }

            if (!this.associations[field][value]) {
                this.associations[field][value] = [];
            }

            if (this.associations[field][value].indexOf(id) === -1) {
                this.associations[field][value].push(id);
            }
        }
    }

    public async update(
        sagaClass: string,
        id: string,
        associationValues: AssociationValueDescriptor,
        data: string
    ): Promise<void> {
        if (!this.sagas[id]) {
            return this.insert(sagaClass, id, associationValues, data);
        }

        this.sagas[id].associations = associationValues;
        this.sagas[id].serializedSaga = data;
        this.associateSaga(id, associationValues);
    }

    public async remove(id: string): Promise<void> {
        if (!this.sagas[id]) {
            return;
        }

        for (const field in this.associations) {
            for (const value in this.associations[field]) {
                if (this.associations[field][value].indexOf(id) > -1) {
                    this.associations[field][value] = this.associations[field][value].filter((sagaId: string) => {
                        return id !== sagaId;
                    });
                }
            }
        }

        delete this.sagas[id];
    }

    public async findById(id: string): Promise<string> {
        if (!this.sagas[id]) {
            return null;
        }

        return this.sagas[id].serializedSaga;
    }

    public async find(sagaClass: string, associationValue: AssociationValueDescriptor): Promise<string[]> {
        let foundIdentities = [];

        for (const field in associationValue) {
            if (!this.associations[field]) {
                return [];
            }

            for (const value in this.associations[field]) {
                if (associationValue[field] === value) {
                    foundIdentities = foundIdentities.concat(this.associations[field][value]);
                }
            }
        }

        const ids = foundIdentities.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return ids.reduce((acc: string[], id: string) => {
            if (this.sagas[id].className === sagaClass) {
                acc.push(id);
            }

            return acc;
        }, []);
    }
}
