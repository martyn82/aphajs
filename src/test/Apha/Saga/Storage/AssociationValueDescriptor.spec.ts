
import {expect} from "chai";
import {AssociationValue} from "../../../../main/Apha/Saga/AssociationValue";
import {AssociationValueDescriptor} from "../../../../main/Apha/Saga/Storage/AssociationValueDescriptor";
import {AssociationValues} from "../../../../main/Apha/Saga/AssociationValues";

describe("AssociationValueDescriptor", () => {
    describe("fromValue", () => {
        it("converts an AssociationValue to an AssociationValueDescriptor", () => {
            const value = new AssociationValue("foo", "bar");
            const descriptor = AssociationValueDescriptor.fromValue(value);

            const keys = Object.keys(descriptor);

            expect(keys).to.have.lengthOf(1);
            expect(keys[0]).to.equal("foo");
            expect(descriptor["foo"]).to.equal("bar");
        });
    });

    describe("fromValues", () => {
        const value1 = new AssociationValue("foo", "bar");
        const value2 = new AssociationValue("bar", "baz");
        const values = new AssociationValues([value1, value2]);
        const descriptor = AssociationValueDescriptor.fromValues(values);

        const keys = Object.keys(descriptor);

        expect(keys).to.have.lengthOf(2);

        expect(keys[0]).to.equal("foo");
        expect(keys[1]).to.equal("bar");

        expect(descriptor["foo"]).to.equal("bar");
        expect(descriptor["bar"]).to.equal("baz");
    });
});
