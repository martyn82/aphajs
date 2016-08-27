
import {Serializer} from "../Serialization/Serializer";
import {SagaFactory} from "./SagaFactory";
import {Saga} from "./Saga";
import {AnyType} from "ts-essentials/target/build/main/lib/inflection";

export class SagaSerializer<T extends Saga> implements Serializer {
    constructor(private serializer: Serializer, private factory: SagaFactory<T>) {}

    public serialize(value: any): string {
        this.factory.dehydrate(value);
        return this.serializer.serialize(value);
    }

    public deserialize(data: string, type?: AnyType): any {
        const deserialized = this.serializer.deserialize(data, type);
        this.factory.hydrate(deserialized);
        return deserialized;
    }
}
