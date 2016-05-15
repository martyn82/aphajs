
import {expect} from "chai";
import {Serializer} from "../../../main/Apha/Serialization/SerializerDecorator";
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

        it("serializes primitives", () => {
            let str = "some string";
            let num = 42;
            let bool = true;
            let nil = null;

            expect(serializer.serialize(str)).to.equal("\"some string\"");
            expect(serializer.serialize(num)).to.equal("42");
            expect(serializer.serialize(bool)).to.equal("true");
            expect(serializer.serialize(nil)).to.equal(null);
        });

        it("serializes typed objects", () => {
            let obj = new Something("foo", false, [1, 2, 3]);
            let serialized = serializer.serialize(obj);

            expect(serialized).to.equal("{\"foo\":\"foo\",\"bar\":false,\"baz\":[1,2,3]}");
        });

        it("serializes only properties that are not ignored", () => {
            let obj = new SomethingComplex("fozvalue", null);
            let serialized = serializer.serialize(obj);

            expect(serialized).to.equal("{\"boz\":null,\"foo\":null}");
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

        it("deserializes primitives", () => {
            expect(serializer.deserialize("\"some string\"")).to.equal("some string");
            expect(serializer.deserialize("42")).to.equal(42);
            expect(serializer.deserialize("true")).to.be.true;
        });

        it("deserializes values to type", () => {
            let obj = new Something("foo", false, [1, 2, 3]);
            let deserialized = serializer.deserialize("{\"foo\":\"foo\",\"bar\":false,\"baz\":[1,2,3]}", Something);

            expect(deserialized).to.be.an.instanceOf(Something);
            expect(deserialized).to.eql(obj);
        });

        it("deserializes complex types", () => {
            let nested = new Something("foo", true, [3, 2, 1]);
            let obj = new SomethingComplex("defaultfoz", nested);

            let smallObjs = [new SmallObj("first"), new SmallObj("second")];
            obj.setFoo(smallObjs);

            let serialized = serializer.serialize(obj);

            expect(serialized).to.equal(
                "{\"boz\":{\"foo\":\"foo\",\"bar\":true,\"baz\":[3,2,1]}," +
                "\"foo\":[{\"prop\":\"first\"},{\"prop\":\"second\"}]}"
            );

            let deserialized = serializer.deserialize(serialized, SomethingComplex);
            expect(deserialized.foz).to.equal("defaultfoz");
            expect(deserialized.boz.bar).to.be.true;
            expect(deserialized.boz.baz).to.eql([3, 2, 1]);
            expect(deserialized.boz.foo).to.equal("foo");

            expect(deserialized.foo).to.eql(smallObjs);
            expect(deserialized.foo[0]).to.be.an.instanceOf(SmallObj);
            expect(deserialized.foo[1]).to.be.an.instanceOf(SmallObj);
            expect(deserialized.foo[0].getProp()).to.equal("first");
            expect(deserialized.foo[1].getProp()).to.equal("second");
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

class SmallObj {
    constructor(private prop: string) {}

    public getProp(): string {
        return this.prop;
    }
}

class SomethingComplex {
    @Serializer.Ignore()
    private foz: string;

    @Serializer.Serializable()
    private boz: Something;

    @Serializer.Serializable({genericType: SmallObj})
    private foo: SmallObj[];

    constructor(foz: string = "defaultfoz", boz: Something) {
        this.foz = foz;
        this.boz = boz;
        this.foo = null;
    }

    public setFoo(foo: SmallObj[]): void {
        this.foo = foo;
    }
}
