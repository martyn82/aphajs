
import {expect} from "chai";
import {Saga} from "../../../main/Apha/Saga/Saga";
import {Event} from "../../../main/Apha/Message/Event";
import {SagaSerializer} from "../../../main/Apha/Saga/SagaSerializer";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {SagaFactory} from "../../../main/Apha/Saga/SagaFactory";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";

describe("SagaSerializer", () => {
    let sagaSerializer;

    beforeEach(() => {
        let serializer = new JsonSerializer();
        let factory = new SagaSerializerSpecSagaFactory();

        sagaSerializer = new SagaSerializer(serializer, factory);
    });

    describe("serialize", () => {
        it("serializes saga to string", () => {
            let saga = new SagaSerializerSpecSaga("id", new AssociationValues());
            let serialized = sagaSerializer.serialize(saga);

            expect(serialized).to.equal("{\"id\":\"id\",\"associationValues\":{\"items\":[]}}");
        });
    });

    describe("deserialize", () => {
        it("deserializes a string to saga", () => {
            let serialized = "{\"id\":\"id\",\"associationValues\":{\"items\":[]}}";
            let saga = sagaSerializer.deserialize(serialized, SagaSerializerSpecSaga);

            expect(saga.getId()).to.equal("id");
        });
    });
});

class SagaSerializerSpecSaga extends Saga {
    public on(event: Event): void {
    }

    public isActive(): boolean {
        return true;
    }
}

class SagaSerializerSpecSagaFactory implements SagaFactory {
    public createSaga(sagaClass: string, id: string, associationValues: AssociationValues): Saga {
        return null;
    }

    public supports(sagaClass: string): boolean {
        return true;
    }

    public hydrate(saga: Saga): void {
    }
}
