
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {Projection} from "../../../../main/Apha/Projections/Projection";
import {ProjectionNotFoundException} from "../../../../main/Apha/Projections/Storage/ProjectionNotFoundException";
import {MongoClient} from "mongodb";
import {MongoDbProjectionStorage} from "../../../../main/Apha/Projections/Storage/MongoDbProjectionStorage";

chai.use(chaiAsPromised);

describe("MongoDbProjectionStorage", () => {
    let mongoDb;
    let storage;

    before(done => {
        MongoClient.connect("mongodb://localhost:27017/test").then(db => {
            mongoDb = db;
            done();
        });
    });

    after(done => {
        mongoDb.dropDatabase().then(() => {
            mongoDb.close();
            done();
        });
    });

    beforeEach(() => {
        const collection = mongoDb.collection("test_projections");
        storage = new MongoDbProjectionStorage(collection, MemoryProjectionStorageSpecProjection);
    });

    afterEach(done => {
        mongoDb.dropCollection("test_projections").then(() => done(), () => done());
    });

    describe("upsert", () => {
        it("inserts a new projection into storage", (done) => {
            const projectionId = "id";
            const projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.find(projectionId)).to.eventually.be.fulfilled.and.satisfy(actualProjection => {
                    expect(actualProjection).to.eql(projection);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("updates an existing projection in storage", (done) => {
            const projectionId = "id";
            let projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                projection = new MemoryProjectionStorageSpecProjection("foo", "foo");

                expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.find(projectionId)).to.eventually.eql(projection).and.notify(done);
                }, done.fail);
            }, done.fail);
        });
    });

    describe("remove", () => {
        it("removes a projection from storage", (done) => {
            const projectionId = "id";
            const projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.remove(projectionId)).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.find(projectionId)).to.eventually.be.rejectedWith(ProjectionNotFoundException)
                        .and.notify(done);
                }, done.fail);
            }, done.fail);
        });

        it("is idempotent", (done) => {
            expect(storage.remove("id")).to.eventually.be.fulfilled.and.notify(done);
        });
    });

    describe("find", () => {
        it("retrieves a stored projection from storage", (done) => {
            const projectionId = "id";
            const projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.find(projectionId)).to.eventually.eql(projection).and.notify(done);
            }, done.fail);
        });

        it("throws exception if projection cannot be found", (done) => {
            expect(storage.find("id")).to.be.rejectedWith(ProjectionNotFoundException).and.notify(done);
        });
    });

    describe("findAll", () => {
        it("retrieves a page of projections from storage", (done) => {
            const projections = [];
            const promises = [];

            for (let i = 0; i < 4; i++) {
                const projection = new MemoryProjectionStorageSpecProjection("foo", "bar");
                projections.push(projection);
                promises.push(
                    expect(storage.upsert(i.toString(), projection)).to.eventually.be.fulfilled
                );
            }

            expect(Promise.all(promises)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findAll(1, 2)).to.eventually.be.fulfilled.and.satisfy(page => {
                    expect(page).to.have.lengthOf(2);
                    expect(page[0]).to.eql(projections[1]);
                    expect(page[1]).to.eql(projections[2]);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("retrieves an empty page if no projections match", (done) => {
            expect(storage.findAll(1, 2)).to.eventually.be.fulfilled.and.satisfy(page => {
                expect(page).to.have.lengthOf(0);
                return true;
            }).and.notify(done);
        });
    });

    describe("clear", () => {
        it("clears all projections from storage", (done) => {
            const projectionId = "id";
            const projection = new MemoryProjectionStorageSpecProjection("foo", "bar");

            expect(storage.upsert(projectionId, projection)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.clear()).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.findAll(0, 500)).to.eventually.have.lengthOf(0).and.notify(done);
                }, done.fail);
            }, done.fail);
        });

        it("is idempotent", (done) => {
            expect(storage.clear()).to.eventually.be.fulfilled.and.notify(done);
        });
    });

    describe("findBy", () => {
        it("retrieves projections matching criteria", (done) => {
            const projections = [];

            projections.push(new MemoryProjectionStorageSpecProjection("foo", "bar"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("foo", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "bar"));

            const promises = [];
            for (let i = 0; i < projections.length; i++) {
                promises.push(
                    expect(storage.upsert(i.toString(), projections[i])).to.eventually.be.fulfilled
                );
            }

            expect(Promise.all(promises)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findBy({foo: "foo"}, 0, 10)).to.eventually.be.fulfilled.and.satisfy(page => {
                    expect(page).to.have.lengthOf(2);
                    expect(page).to.contain(projections[0]);
                    expect(page).to.contain(projections[2]);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("retrieves projections matching multiple criteria", (done) => {
            const projections = [];

            projections.push(new MemoryProjectionStorageSpecProjection("foo", "bar"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("foo", "foo"));
            projections.push(new MemoryProjectionStorageSpecProjection("bar", "bar"));

            const promises = [];

            for (let i = 0; i < projections.length; i++) {
                promises.push(
                    expect(storage.upsert(i.toString(), projections[i])).to.eventually.be.fulfilled
                );
            }

            expect(Promise.all(promises)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findBy({foo: "foo", bar: "bar"}, 0, 10)).to.eventually.be.fulfilled.and.satisfy(page => {
                    expect(page).to.have.lengthOf(1);
                    expect(page[0]).to.eql(projections[0]);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });
    });
});

class MemoryProjectionStorageSpecProjection extends Projection {
    constructor(public foo: string, public bar: string) {
        super();
    }
}
