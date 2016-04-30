
import {SagaManager, SagaCreationPolicy} from "./SagaManager";
import {Saga, SagaType} from "./Saga";
import {Event} from "../Message/Event";
import {AssociationValues} from "./AssociationValues";

export class SimpleSagaManager<T extends Saga> extends SagaManager<T> {
    protected extractAssociationValues(sagaType: SagaType<T>, event: Event): AssociationValues {
        return this.getAssociationValueResolver().extractAssociationValues(event);
    }

    protected getSagaCreationPolicy(sagaType: SagaType<T>, event: Event): SagaCreationPolicy {
        return SagaCreationPolicy.IFNoneFound;
    }
}
