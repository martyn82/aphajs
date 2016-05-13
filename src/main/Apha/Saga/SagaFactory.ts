
import {AssociationValues} from "./AssociationValues";
import {Saga, SagaType} from "./Saga";

export interface SagaFactory<T extends Saga> {
    createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T;
    supports(sagaType: SagaType<T>): boolean;
    hydrate(saga: T): void;
    dehydrate(saga: T): void;
}
