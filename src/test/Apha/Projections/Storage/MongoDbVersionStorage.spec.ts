
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {MongoClient} from "mongodb";
import {MongoDbVersionStorage} from "../../../../main/Apha/Projections/Storage/MongoDbVersionStorage";

chai.use(chaiAsPromised);

describe("MongoDbVersionStorage", () => {
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
        const collection = mongoDb.collection("versions");
        storage = new MongoDbVersionStorage(collection);
    });

    afterEach(done => {
        mongoDb.dropCollection("versions").then(() => done(), () => done());
    });

    describe("upsert", () => {
        it("should insert a non-existing version", (done) => {
            expect(storage.upsert("foo", 1)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                    return version === 1;
                }).and.notify(done);
            }, error => done(error));
        });

        it("should update an existing version", (done) => {
            expect(Promise.all([
                expect(storage.upsert("foo", 1)).to.eventually.be.fulfilled,
                expect(storage.upsert("foo", 2)).to.eventually.be.fulfilled
            ])).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                    return version === 2;
                }).and.notify(done);
            }, error => done(error));
        });
    });

    describe("findByName", () => {
        it("should retrieve version by name", (done) => {
            expect(storage.upsert("foo", 12)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                    return version === 12;
                }).and.notify(done);
            }, error => done(error));
        });

        it("should return NULL if no version is stored", (done) => {
            expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                return version === null;
            }).and.notify(done);
        });
    });
});
