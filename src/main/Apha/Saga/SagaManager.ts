
import {EventListener} from "../EventHandling/EventListener";
import {Saga, SagaType} from "./Saga";
import {SagaFactory} from "./SagaFactory";
import {SagaRepository} from "./SagaRepository";
import {Event} from "../Message/Event";
import {AssociationValues} from "./AssociationValues";
import {IdentityProvider} from "../Domain/IdentityProvider";
import {AssociationValueResolver} from "./Annotation/AssociationValueResolver";

export enum SagaCreationPolicy {
    Never,
    IFNoneFound,
    Always
}

export abstract class SagaManager<T extends Saga> implements EventListener {
    constructor(
        private sagaTypes: SagaType<T>[],
        private repository: SagaRepository<T>,
        private associationValueResolver: AssociationValueResolver,
        private factory: SagaFactory<T>
    ) {}

    public async on(event: Event): Promise<void> {
        let handled = false;

        this.sagaTypes.forEach(async (sagaType) => {
            const associationValues = this.extractAssociationValues(sagaType, event);

            for (const associationValue of associationValues) {
                const sagaIds = await this.repository.find(sagaType, associationValue);

                sagaIds.forEach(async (sagaId) => {
                    const saga = await this.repository.load(sagaId, sagaType);
                    saga.on(event);
                    await this.commit(saga);
                    handled = true;
                });
            }

            if (
                this.getSagaCreationPolicy(sagaType, event) === SagaCreationPolicy.Always ||
                (!handled && this.getSagaCreationPolicy(sagaType, event) === SagaCreationPolicy.IFNoneFound)
            ) {
                const saga = this.factory.createSaga(sagaType, IdentityProvider.generateNew(), associationValues);
                saga.on(event);
                await this.commit(saga);
            }
        });
    }

    protected async commit(saga: T): Promise<void> {
        return this.repository.commit(saga);
    }

    protected getAssociationValueResolver(): AssociationValueResolver {
        return this.associationValueResolver;
    }

    protected abstract extractAssociationValues(sagaType: SagaType<T>, event: Event): AssociationValues;
    protected abstract getSagaCreationPolicy(sagaType: SagaType<T>, event: Event): SagaCreationPolicy;
}
