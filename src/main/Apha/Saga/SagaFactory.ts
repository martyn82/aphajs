
import {AssociationValues} from "./AssociationValues";
import {Saga} from "./Saga";

export interface SagaFactory {
    createSaga(sagaClass: string, id: string, associationValues: AssociationValues): Saga;
    supports(sagaClass: string): boolean;
    hydrate(saga: Saga): void;
}
