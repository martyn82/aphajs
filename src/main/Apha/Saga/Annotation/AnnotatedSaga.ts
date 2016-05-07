
import {Saga} from "../Saga";
import {AssociationValues} from "../AssociationValues";
import {Event} from "../../Message/Event";
import {SagaEventHandlerDispatcher} from "../../Decorators/SagaEventHandlerDecorator";
import {ParameterResolver} from "../../Decorators/ParameterResolver";
import {AssociationValue} from "../AssociationValue";

export abstract class AnnotatedSaga extends Saga {
    private active: boolean = false;
    protected parameterResolver: ParameterResolver;

    constructor(id: string) {
        super(id, new AssociationValues());
    }

    public setParameterResolver(parameterResolver: ParameterResolver): void {
        this.parameterResolver = parameterResolver;
    }

    public associateWith(associationValue: AssociationValue): void {
        this.associationValues.add(associationValue);
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
