
import {SagaFactory} from "../SagaFactory";
import {AnnotatedSaga} from "./AnnotatedSaga";
import {ParameterResolver} from "./ParameterResolver";
import {ClassNameInflector} from "../../Inflection/ClassNameInflector";
import {SagaType} from "../Saga";
import {AssociationValues} from "../AssociationValues";
import {UnsupportedSagaException} from "../UnsupportedSagaException";

export class AnnotatedSagaFactory<T extends AnnotatedSaga | AnnotatedSaga> implements SagaFactory<T> {
    constructor(private parameterResolver: ParameterResolver) {}

    public createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T {
        if (!this.supports(sagaType)) {
            const sagaClass = ClassNameInflector.className(sagaType);
            throw new UnsupportedSagaException(sagaClass);
        }

        const saga = new sagaType(id, associationValues);

        for (const associationValue of associationValues) {
            saga.associateWith(associationValue);
        }

        this.hydrate(saga);
        return saga;
    }

    public supports(sagaType: SagaType<T>): boolean {
        return true;
    }

    public hydrate(saga: T): void {
        saga.setParameterResolver(this.parameterResolver);
    }

    public dehydrate(saga: T): void {
        saga.setParameterResolver(null);
    }
}
