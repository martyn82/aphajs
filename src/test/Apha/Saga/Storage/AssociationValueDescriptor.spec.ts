
import {expect} from "chai";
import {AssociationValue} from "../../../../main/Apha/Saga/AssociationValue";
import {AssociationValueDescriptor} from "../../../../main/Apha/Saga/Storage/AssociationValueDescriptor";
import {AssociationValues} from "../../../../main/Apha/Saga/AssociationValues";

describe("AssociationValueDescriptor", () => {
    describe("fromValue", () => {
        it("converts an AssociationValue to an AssociationValueDescriptor", () => {
            let value = new AssociationValue("foo", "bar");
            let descriptor = AssociationValueDescriptor.fromValue(value);

            let keys = Object.keys(descriptor);

            expect(keys).to.have.lengthOf(1);
            expect(keys[0]).to.equal("foo");
            expect(descriptor["foo"]).to.equal("bar");
        });
    });

    describe("fromValues", () => {
        let value1 = new AssociationValue("foo", "bar");
        let value2 = new AssociationValue("bar", "baz");
        let values = new AssociationValues([value1, value2]);
        let descriptor = AssociationValueDescriptor.fromValues(values);

        let keys = Object.keys(descriptor);

        expect(keys).to.have.lengthOf(2);

        expect(keys[0]).to.equal("foo");
        expect(keys[1]).to.equal("bar");

        expect(descriptor["foo"]).to.equal("bar");
        expect(descriptor["bar"]).to.equal("baz");
    });
});
