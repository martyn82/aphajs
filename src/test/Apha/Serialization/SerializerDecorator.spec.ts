
import "reflect-metadata";
import {expect} from "chai";
import {Serializer} from "../../../main/Apha/Serialization/SerializerDecorator";

describe("SerializerDecorator", () => {
    describe("Ignore", () => {
        it("registers a property to be ignored during (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClassIgnore();
            let ignores = Reflect.getMetadata(Serializer.IGNORE_SERIALIZATION_PROPERTIES, target);

            expect(ignores).to.have.lengthOf(1);
            expect(ignores[0]).to.eql("bar");
        });
    });

    describe("Serializable", () => {
        it("inspects a (complex) property for correct (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClassSerializable();
            let serializables = Reflect.getMetadata(Serializer.SERIALIZABLE_PROPERTIES, target);

            expect(serializables["bar"]).to.eql({
                primaryType: SerializerDecoratorSpecClassIgnore
            });
        });
    });
});

class SerializerDecoratorSpecClassIgnore {
    private foo: string;

    @Serializer.Ignore()
    private bar: string;
}

class SerializerDecoratorSpecClassSerializable {
    private foo: string;

    @Serializer.Serializable()
    private bar: SerializerDecoratorSpecClassIgnore;
}
