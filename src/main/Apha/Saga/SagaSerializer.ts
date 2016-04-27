
import {Serializer} from "../Serialization/Serializer";
import {SagaFactory} from "./SagaFactory";
import {Saga} from "./Saga";

export class SagaSerializer<T extends Saga> implements Serializer {
    constructor(private serializer: Serializer, private factory: SagaFactory<T>) {}

    public serialize(value: any): string {
        return this.serializer.serialize(value);
    }

    public deserialize(data: string, type?: {new(...args: any[]): any}): any {
        let deserialized = this.serializer.deserialize(data, type);
        this.factory.hydrate(deserialized);
        return deserialized;
    }
}
