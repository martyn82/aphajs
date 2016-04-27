
import {EventListener} from "../EventHandling/EventListener";
import {Saga} from "./Saga";
import {SagaFactory} from "./SagaFactory";
import {SagaRepository} from "./SagaRepository";
import {Event} from "../Message/Event";

export abstract class SagaManager<T extends Saga> implements EventListener {
    constructor(
        private sagaTypes: {new(...args: any[]): T}[],
        private repository: SagaRepository<T>,
        // private associationValueResolver: AssociationValueResolver,
        private factory: SagaFactory<T>
    ) {}

    public on(event: Event): void {
    }

    protected commit(saga: T): void {
    }
}
