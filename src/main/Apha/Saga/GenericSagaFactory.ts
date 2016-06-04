
import {Saga, SagaType} from "./Saga";
import {SagaFactory} from "./SagaFactory";
import {AssociationValues} from "./AssociationValues";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnsupportedSagaException} from "./UnsupportedSagaException";

export class GenericSagaFactory<T extends Saga> implements SagaFactory<T> {
    public createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T {
        if (!this.supports(sagaType)) {
            const sagaClass = ClassNameInflector.className(sagaType);
            throw new UnsupportedSagaException(sagaClass);
        }

        return new sagaType(id, associationValues);
    }

    public supports(sagaType: SagaType<T>): boolean {
        return true;
    }

    public hydrate(saga: T): void {
        // no-op
    }

    public dehydrate(saga: T): void {
        // no-op
    }
}
