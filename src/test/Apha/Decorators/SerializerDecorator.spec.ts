
import "reflect-metadata";
import {expect} from "chai";
import {MetadataKeys} from "./../../../../main/Apha/Decorators/MetadataKeys";
import {Serializer} from "./../../../../main/Apha/Decorators/SerializerDecorator";

describe("SerializerDecorator", () => {
    describe("ignore", () => {
        it("registers a property to be ignored during (de-)serialization", () => {
            let target = new SerializerDecoratorSpecClass();
            let ignores = Reflect.getOwnMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, target);

            console.log(ignores);
            expect(ignores[0]).to.eql("bar");
        })
    });
});

class SerializerDecoratorSpecClass {
    private foo: string;

    @Serializer.Ignore()
    private bar: string;
}
