
import {AssociationValues} from "./AssociationValues";
import {Saga} from "./Saga";

export interface SagaFactory<T extends Saga> {
    createSaga(sagaType: {new(...args: any[]): T}, id: string, associationValues: AssociationValues): T;
    supports(sagaType: {new(...args: any[]): T}): boolean;
    hydrate(saga: T): void;
}
