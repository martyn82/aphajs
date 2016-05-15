
import "reflect-metadata";
import {expect} from "chai";
import {
    AggregateIdentifier,
    AggregateIdentifierDecorator
} from "../../../main/Apha/Domain/AggregateIdentifierDecorator";
import {DecoratorException} from "../../../main/Apha/Decorators/DecoratorException";

describe("AggregateIdentifierDecorator", () => {
    it("registers a property as aggregate identifier", () => {
        let target = new AggregateIdentifierDecoratorSpecClass();
        let identifier = Reflect.getMetadata(AggregateIdentifierDecorator.AGGREGATE_IDENTIFIER, target);

        expect(identifier).to.eql({
            name: "identifier",
            type: Number
        });
    });

    it("throws exception if an aggregate identifier is already registered", () => {
        let target = new AggregateIdentifierDecoratorSpecClassInvalid();

        AggregateIdentifier()(target, "id");

        expect(() => {
            AggregateIdentifier()(target, "some");
        }).to.throw(DecoratorException);
    });
});

class AggregateIdentifierDecoratorSpecClass {
    @AggregateIdentifier()
    private identifier: number;
}

class AggregateIdentifierDecoratorSpecClassInvalid {
    private id: string;
    private some: number;

    constructor(@AggregateIdentifier() private foo: number = 1) {}
}
