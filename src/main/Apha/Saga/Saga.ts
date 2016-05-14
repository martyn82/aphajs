
import {Serializer} from "../Decorators/SerializerDecorator";
import {EventListener} from "../EventHandling/EventListener";
import {AssociationValues} from "./AssociationValues";
import {Event} from "../Message/Event";

export type SagaType<T extends Saga | Saga> = {new(...args: any[]): T};

export abstract class Saga implements EventListener {
    @Serializer.Serializable()
    protected associationValues: AssociationValues;

    constructor(private id: string, associationValues: AssociationValues) {
        this.associationValues = associationValues;
    }

    public abstract on(event: Event): void;
    public abstract isActive(): boolean;

    public getAssociationValues(): AssociationValues {
        return this.associationValues;
    }

    public getId(): string {
        return this.id;
    }
}
