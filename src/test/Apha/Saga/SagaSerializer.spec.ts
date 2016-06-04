
import {expect} from "chai";
import {Saga, SagaType} from "../../../main/Apha/Saga/Saga";
import {Event} from "../../../main/Apha/Message/Event";
import {SagaSerializer} from "../../../main/Apha/Saga/SagaSerializer";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {SagaFactory} from "../../../main/Apha/Saga/SagaFactory";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";

describe("SagaSerializer", () => {
    let sagaSerializer;

    beforeEach(() => {
        const serializer = new JsonSerializer();
        const factory = new SagaSerializerSpecSagaFactory();

        sagaSerializer = new SagaSerializer(serializer, factory);
    });

    describe("serialize", () => {
        it("serializes saga to string", () => {
            const saga = new SagaSerializerSpecSaga("id", new AssociationValues());
            const serialized = sagaSerializer.serialize(saga);

            expect(serialized).to.equal("{\"id\":\"id\",\"associationValues\":{\"items\":[]}}");
        });
    });

    describe("deserialize", () => {
        it("deserializes a string to saga", () => {
            const serialized = "{\"id\":\"id\",\"associationValues\":{\"items\":[]}}";
            const saga = sagaSerializer.deserialize(serialized, SagaSerializerSpecSaga);

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

class SagaSerializerSpecSagaFactory implements SagaFactory<SagaSerializerSpecSaga> {
    public createSaga(
        sagaType: SagaType<SagaSerializerSpecSaga>,
        id: string,
        associationValues: AssociationValues
    ): SagaSerializerSpecSaga {
        return null;
    }

    public supports(sagaType: SagaType<SagaSerializerSpecSaga>): boolean {
        return true;
    }

    public hydrate(saga: SagaSerializerSpecSaga): void {}
    public dehydrate(saga: SagaSerializerSpecSaga): void {}
}
