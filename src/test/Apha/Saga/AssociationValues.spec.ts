
import {expect} from "chai";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";
import {AssociationValue} from "../../../main/Apha/Saga/AssociationValue";

describe("AssociationValues", () => {
    let collection;

    beforeEach(() => {
        collection = new AssociationValues();
    });

    it("can be constructed with items", () => {
        let collection = new AssociationValues([new AssociationValue("foo", "bar")]);
        expect(collection.size()).to.equal(1);
    });

    describe("contains", () => {
        it("returns false if item does not exist in collection", () => {
            let item = new AssociationValue("foo", "bar");
            expect(collection.contains(item)).to.be.false;
        });

        it("returns true if item does exist in collection", () => {
            let item = new AssociationValue("foo", "bar");
            collection.add(item);
            expect(collection.contains(item)).to.be.true;
        });
    });

    describe("add", () => {
        it("adds an item to the collection", () => {
            let item = new AssociationValue("foo", "bar");
            collection.add(item);
            expect(collection.size()).to.equal(1);
        });

        it("adds no item twice to the collection", () => {
            let item = new AssociationValue("foo", "bar");

            collection.add(item);
            collection.add(item);

            expect(collection.size()).to.equal(1);
        });
    });

    describe("clear", () => {
        it("clears all items from collection", () => {
            let item = new AssociationValue("foo", "bar");
            collection.add(item);

            collection.clear();
            expect(collection.size()).to.equal(0);
        });
    });

    describe("getArrayCopy", () => {
        it("retrieves an array copy of the inner items", () => {
            let item = new AssociationValue("foo", "bar");
            collection.add(item);

            let items = collection.getArrayCopy();
            expect(items).to.have.lengthOf(1);
        });
    });
});
