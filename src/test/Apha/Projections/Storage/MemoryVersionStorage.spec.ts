
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {MemoryVersionStorage} from "../../../../main/Apha/Projections/Storage/MemoryVersionStorage";

chai.use(chaiAsPromised);

describe("MemoryVersionStorage", () => {
    let storage;

    beforeEach(() => {
        storage = new MemoryVersionStorage();
    });

    describe("findByName", () => {
        it("should retrieve version by name", (done) => {
            expect(storage.upsert("foo", 12)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                    return version === 12;
                }).and.notify(done);
            }, done.fail);
        });

        it("should return NULL if no version is stored", (done) => {
            expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                return version === null;
            }).and.notify(done);
        });
    });

    describe("upsert", () => {
        it("should insert a non-existing version", (done) => {
            expect(storage.upsert("foo", 1)).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                    return version === 1;
                }).and.notify(done);
            }, done.fail);
        });

        it("should update an existing version", (done) => {
            expect(Promise.all([
                expect(storage.upsert("foo", 1)).to.eventually.be.fulfilled,
                expect(storage.upsert("foo", 2)).to.eventually.be.fulfilled
            ])).to.eventually.be.fulfilled
                .and.then(() => {
                    expect(storage.findByName("foo")).to.eventually.be.fulfilled.and.satisfy(version => {
                        return version === 2;
                    }).and.notify(done);
                }, done.fail);
        });
    });
});
