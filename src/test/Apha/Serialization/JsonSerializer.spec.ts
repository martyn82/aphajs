
import {expect} from "chai";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";

describe("JsonSerializer", () => {
    let serializer;

    beforeEach(() => {
        serializer = new JsonSerializer();
    });

    describe("serialize", () => {
        it("serializes values", () => {
            let serialized = serializer.serialize({
                string: "some string",
                numeric: 1.23,
                nested: {
                    flag: true,
                    otherFlag: false
                },
                things: [1, "2", true, false]
            });

            expect(serialized).to.equal(
                "{\"string\":\"some string\",\"numeric\":1.23,\"nested\"" +
                ":{\"flag\":true,\"otherFlag\":false},\"things\":[1,\"2\",true,false]}"
            );
        });

        it("serializes typed objects", () => {
            let obj = new Something("foo", false, [1, 2, 3]);
            let serialized = serializer.serialize(obj);

            expect(serialized).to.equal("{\"foo\":\"foo\",\"bar\":false,\"baz\":[1,2,3]}");
        });
    });

    describe("deserialize", () => {
        it("deserializes values", () => {
            let serialized = "{\"string\":\"some string\",\"numeric\":1.23,\"nested\"" +
                ":{\"flag\":true,\"otherFlag\":false},\"things\":[1,\"2\",true,false]}";

            let deserialized = serializer.deserialize(serialized);

            expect(deserialized).to.eql({
                string: "some string",
                numeric: 1.23,
                nested: {
                    flag: true,
                    otherFlag: false
                },
                things: [1, "2", true, false]
            });
        });

        it("deserializes values to type", () => {
            let obj = new Something("foo", false, [1, 2, 3]);
            let deserialized = serializer.deserialize("{\"foo\":\"foo\",\"bar\":false,\"baz\":[1,2,3]}", Something);

            expect(deserialized).to.be.an.instanceOf(Something);
            expect(deserialized).to.eql(obj);
        });

        it("deserializes complex types", () => {
            let nested = new Something("foo", true, [3, 2, 1]);
            let obj = new SomethingComplex(nested);
            let serialized = serializer.serialize(obj);

            expect(serialized).to.equal("{\"boz\":{\"foo\":\"foo\",\"bar\":true,\"baz\":[3,2,1]}}");

            let deserialized = serializer.deserialize(serialized, SomethingComplex);
            expect(deserialized).to.eql(obj);
        });
    });
});

interface SomethingInterface {
    foo: string;
    bar: boolean;
    baz: number[];
}

class Something implements SomethingInterface {
    constructor(public foo: string, public bar: boolean, public baz: number[]) {}
}

class SomethingComplex {
    constructor(private boz: Something) {}
}
