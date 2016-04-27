
import {EventListener} from "../EventHandling/EventListener";
import {Saga} from "./Saga";
import {SagaFactory} from "./SagaFactory";
import {SagaRepository} from "./SagaRepository";
import {Event} from "../Message/Event";
import {AssociationValues} from "./AssociationValues";
import {IdentityProvider} from "../Domain/IdentityProvider";

export abstract class SagaManager<T extends Saga> implements EventListener {
    constructor(
        private sagaTypes: {new(...args: any[]): T}[],
        private repository: SagaRepository<T>,
        // private associationValueResolver: AssociationValueResolver,
        private factory: SagaFactory<T>
    ) {}

    public on(event: Event): void {
        let handled = false;

        this.sagaTypes.forEach((sagaType) => {
            let associationValues = this.extractAssociationValues(sagaType, event);

            associationValues.getArrayCopy().forEach((associationValue) => {
                let sagaIds = this.repository.find(sagaType, associationValue);

                sagaIds.forEach((sagaId) => {
                    let saga = this.repository.load(sagaId, sagaType);
                    saga.on(event);
                    this.commit(saga);
                    handled = true;
                });
            });

            if (
                this.getSagaCreationPolicy(sagaType, event) === 0 /* ALWAYS */ ||
                (!handled && this.getSagaCreationPolicy(sagaType, event) === 1 /* IF NONE FOUND */)
            ) {
                let saga = this.factory.createSaga(sagaType, IdentityProvider.generateNew(), associationValues);
                saga.on(event);
                this.commit(saga);
            }
        });
    }

    protected commit(saga: T): void {
        this.repository.commit(saga);
    }

    protected abstract extractAssociationValues(sagaType: {new(...args: any[]): T}, event: Event): AssociationValues;
    protected abstract getSagaCreationPolicy(sagaType: {new(...args: any[]): T}, event: Event): number;
}
