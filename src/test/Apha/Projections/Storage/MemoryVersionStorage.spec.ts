
import {expect} from "chai";
import {MemoryVersionStorage} from "../../../../main/Apha/Projections/Storage/MemoryVersionStorage";

describe("MemoryVersionStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryVersionStorage();
    });

    describe("findByName", () => {
        it("should retrieve version by name", () => {
            storage.upsert("foo", 12);

            const version = storage.findByName("foo");
            expect(version).to.equal(12);
        });

        it("should return NULL if no version is stored", () => {
            const version = storage.findByName("foo");
            expect(version).to.be.null;
        });
    });

    describe("upsert", () => {
        it("should insert a non-existing version", () => {
            storage.upsert("foo", 1);

            const version = storage.findByName("foo");
            expect(version).to.equal(1);
        });

        it("should update an existing version", () => {
            storage.upsert("foo", 1);
            storage.upsert("foo", 2);

            const version = storage.findByName("foo");
            expect(version).to.equal(2);
        });
    });
});
