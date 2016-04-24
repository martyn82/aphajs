
import {expect} from "chai";
import {MemoryProjectionStorage} from "../../../../main/Apha/Projections/Storage/MemoryProjectionStorage";
import {Projection} from "../../../../main/Apha/Projections/Projection";
import {ProjectionNotFoundException} from "../../../../main/Apha/Projections/Storage/ProjectionNotFoundException";

describe("MemoryProjectionStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryProjectionStorage();
    });

    describe("upsert", () => {
        it("inserts a new projection into storage", () => {
            let projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            storage.upsert(projectionId, projection);

            expect(storage.find(projectionId)).to.equal(projection);
        });

        it("updates an existing projection in storage", () => {
            let projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            // insert
            storage.upsert(projectionId, projection);

            projection = new MemoryProjectionStorageSpecProjection("foo", "foo");
            storage.upsert(projectionId, projection);

            expect(storage.find(projectionId)).to.equal(projection);
        });
    });

    describe("delete", () => {
        it("removes a projection from storage", () => {
            let projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");
            storage.upsert(projectionId, projection);

            storage.delete(projectionId);

            expect(() => {
                storage.find(projectionId);
            }).to.throw(ProjectionNotFoundException);
        });

        it("is idempotent", () => {
            expect(() => {
                storage.delete("id");
            }).not.to.throw(Error);
        });
    });

    describe("find", () => {
        it("retrieves a stored projection from storage", () => {
            let projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");
            storage.upsert(projectionId, projection);

            let actual = storage.find(projectionId);
            expect(actual).to.equal(projection);
        });

        it("throws exception if projection cannot be found", () => {
            expect(() => {
                storage.find("id");
            }).to.throw(ProjectionNotFoundException);
        });
    });

    describe("findAll", () => {
        it("retrieves a page of projections from storage", () => {
            let projections = [];

            for (let i = 0; i < 4; i++) {
                let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");
                projections.push(projection);
                storage.upsert(i.toString(), projection);
            }

            let page = storage.findAll(1, 2);

            expect(page).to.have.lengthOf(2);
            expect(page[0]).to.equal(projections[1]);
            expect(page[1]).to.equal(projections[2]);
        });

        it("retrieves an empty page if no projections match", () => {
            let page = storage.findAll(1, 2);
            expect(page).to.have.lengthOf(0);
        });
    });

    describe("clear", () => {
        it("clears all projections from storage", () => {
            let projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");
            storage.upsert(projectionId, projection);

            storage.clear();

            expect(storage.findAll(0, 500)).to.have.lengthOf(0);
        });

        it("is idempotent", () => {
            expect(() => {
                storage.clear();
            }).to.not.throw(Error);
        });
    });

    describe("findBy", () => {
        it("retrieves projections matching criteria", () => {
            let projections = []

            projections.push(new MemoryProjectionStorageSpecProjection("foo", "bar"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("foo", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "bar"));

            for (let i = 0; i < projections.length; i++) {
                storage.upsert(i.toString(), projections[i]);
            }

            let page = storage.findBy({foo: "foo"}, 0, 10);

            expect(page).to.have.lengthOf(2);
            expect(page[0]).to.equal(projections[0]);
            expect(page[1]).to.equal(projections[2]);
        });

        it("retrieves projections matching multiple criteria", () => {
            let projections = []

            projections.push(new MemoryProjectionStorageSpecProjection("foo", "bar"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("foo", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "bar"));

            for (let i = 0; i < projections.length; i++) {
                storage.upsert(i.toString(), projections[i]);
            }

            let page = storage.findBy({foo: "foo", bar: "bar"}, 0, 10);

            expect(page).to.have.lengthOf(1);
            expect(page[0]).to.equal(projections[0]);
        });
    });
});

class MemoryProjectionStorageSpecProjection extends Projection {
    constructor(public foo: string, public bar: string) {
        super();
    }
}
