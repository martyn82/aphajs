
import "reflect-metadata";
import {expect} from "chai";
import {MetadataKeys} from "./../../../main/Apha/Decorators/MetadataKeys";
import {Serializer} from "./../../../main/Apha/Decorators/SerializerDecorator";

describe("SerializerDecorator", () => {
    describe("Ignore", () => {
        it("registers a property to be ignored during (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClass();
            let ignores = Reflect.getMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, target);

            expect(ignores).to.have.lengthOf(1);
            expect(ignores[0]).to.eql("bar");
        });
    });

    describe("Serializable", () => {
        it("inspects a (complex) property for correct (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClass2();
            let serializables = Reflect.getMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, target);

            expect(serializables["bar"]).to.eql(SerializerDecoratorSpecClass);
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
