
import "reflect-metadata";
import {expect} from "chai";
import {Serializer} from "../../../main/Apha/Serialization/SerializerDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";

describe("SerializerDecorator", () => {
    describe("Ignore", () => {
        it("registers a property to be ignored during (de-)serialization", () => {
            const target = new SerializerDecoratorSpecClassIgnore();
            const ignores = Reflect.getMetadata(Serializer.IGNORE_SERIALIZATION_PROPERTIES, target);

            expect(ignores).to.have.lengthOf(1);
            expect(ignores[0]).to.eql("bar");
        });

        it("throws exception if no property name was passed", () => {
            const target = new SerializerDecoratorSpecClassSerializable();

            expect(() => {
                Serializer.Ignore()(target, undefined);
            }).to.throw(DecoratorException);
        });
    });

    describe("Serializable", () => {
        it("inspects a (complex) property for correct (de-)serialization", () => {
            const target = new SerializerDecoratorSpecClassSerializable();
            const serializables = Reflect.getMetadata(Serializer.SERIALIZABLE_PROPERTIES, target);

            expect(serializables["bar"]).to.eql({
                primaryType: SerializerDecoratorSpecClassIgnore
            });
        });

        it("throws exception if no property name was passed", () => {
            const target = new SerializerDecoratorSpecClassIgnore();

            expect(() => {
                Serializer.Serializable()(target, undefined);
            }).to.throw(DecoratorException);
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
