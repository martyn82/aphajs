
import "reflect-metadata";
import {expect} from "chai";
import {
    Serializer,
    IGNORE_SERIALIZATION_PROPERTIES,
    SERIALIZABLE_PROPERTIES
} from "../../../main/Apha/Serialization/SerializerDecorator";

describe("SerializerDecorator", () => {
    describe("Ignore", () => {
        it("registers a property to be ignored during (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClass();
            let ignores = Reflect.getMetadata(IGNORE_SERIALIZATION_PROPERTIES, target);

            expect(ignores).to.have.lengthOf(1);
            expect(ignores[0]).to.eql("bar");
        });
    });

    describe("Serializable", () => {
        it("inspects a (complex) property for correct (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClass2();
            let serializables = Reflect.getMetadata(SERIALIZABLE_PROPERTIES, target);

            expect(serializables["bar"]).to.eql({
                primaryType: SerializerDecoratorSpecClass
            });
        });
    });
});

class SerializerDecoratorSpecClass {
    private foo: string;

    @Serializer.Ignore()
    private bar: string;
}

class SerializerDecoratorSpecClass2 {
    private foo: string;

    @Serializer.Serializable()
    private bar: SerializerDecoratorSpecClass;
}
