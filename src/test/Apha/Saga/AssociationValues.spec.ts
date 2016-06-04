
import {expect} from "chai";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";
import {AssociationValue} from "../../../main/Apha/Saga/AssociationValue";

describe("AssociationValues", () => {
    let collection;

    beforeEach(() => {
        collection = new AssociationValues();
    });

    it("can be constructed with items", () => {
        const collection = new AssociationValues([new AssociationValue("foo", "bar")]);
        expect(collection.size()).to.equal(1);
    });

    it("is iterable", () => {
        const innerValues = [
            new AssociationValue("foo", "bar"),
            new AssociationValue("baz", "boo")
        ];

        const values = new AssociationValues(innerValues);
        let iteration = 0;

        for (const value of values) {
            expect(value).to.eql(innerValues[iteration]);
            iteration++;
        }

        expect(iteration).to.equal(innerValues.length);
    });

    describe("contains", () => {
        it("returns false if item does not exist in collection", () => {
            const item = new AssociationValue("foo", "bar");
            expect(collection.contains(item)).to.be.false;
        });

        it("returns true if item does exist in collection", () => {
            const item = new AssociationValue("foo", "bar");
            collection.add(item);
            expect(collection.contains(item)).to.be.true;
        });
    });

    describe("add", () => {
        it("adds an item to the collection", () => {
            const item = new AssociationValue("foo", "bar");
            collection.add(item);
            expect(collection.size()).to.equal(1);
        });

        it("adds no item twice to the collection", () => {
            const item = new AssociationValue("foo", "bar");

            collection.add(item);
            collection.add(item);

            expect(collection.size()).to.equal(1);
        });
    });

    describe("clear", () => {
        it("clears all items from collection", () => {
            const item = new AssociationValue("foo", "bar");
            collection.add(item);

            collection.clear();
            expect(collection.size()).to.equal(0);
        });
    });

    describe("getArrayCopy", () => {
        it("retrieves an array copy of the inner items", () => {
            const item = new AssociationValue("foo", "bar");
            collection.add(item);

            const items = collection.getArrayCopy();
            expect(items).to.have.lengthOf(1);
        });
    });
});
