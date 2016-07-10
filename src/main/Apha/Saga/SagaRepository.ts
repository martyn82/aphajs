
import {SagaStorage} from "./Storage/SagaStorage";
import {SagaSerializer} from "./SagaSerializer";
import {Saga, SagaType} from "./Saga";
import {AssociationValue} from "./AssociationValue";
import {AssociationValueDescriptor} from "./Storage/AssociationValueDescriptor";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class SagaRepository<T extends Saga> {
    constructor(private storage: SagaStorage, private serializer: SagaSerializer<T>) {}

    public async add(saga: T): Promise<void> {
        if (!saga.isActive()) {
            return;
        }

        return this.storage.insert(
            ClassNameInflector.classOf(saga),
            saga.getId(),
            AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
            this.serializer.serialize(saga)
        );
    }

    public async commit(saga: T): Promise<void> {
        if (!saga.isActive()) {
            this.storage.remove(saga.getId());
            return;
        }

        return this.storage.update(
            ClassNameInflector.classOf(saga),
            saga.getId(),
            AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
            this.serializer.serialize(saga)
        );
    }

    public async find(sagaType: SagaType<T>, associationValue: AssociationValue): Promise<string[]> {
        const sagaClass = ClassNameInflector.className(sagaType);
        return this.storage.find(sagaClass, AssociationValueDescriptor.fromValue(associationValue));
    }

    public async load(id: string, sagaType: SagaType<T>): Promise<T> {
        const sagaData = await this.storage.findById(id);

        if (!sagaData) {
            return null;
        }

        return this.serializer.deserialize(sagaData, sagaType);
    }
}
