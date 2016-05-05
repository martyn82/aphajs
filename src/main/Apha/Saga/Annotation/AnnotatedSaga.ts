
import {Saga} from "../Saga";
import {AssociationValues} from "../AssociationValues";
import {Event} from "../../Message/Event";
import {SagaEventHandlerDispatcher} from "../../Decorators/SagaEventHandlerDecorator";

export abstract class AnnotatedSaga extends Saga {
    private active: boolean = false;

    constructor(id: string) {
        super(id, new AssociationValues());
    }

    @SagaEventHandlerDispatcher
    public on(event: Event): void {
    }

    public isActive(): boolean {
        return this.active;
    }

    protected start(): void {
        this.active = true;
    }

    protected end(): void {
        this.active = false;
    }
}
