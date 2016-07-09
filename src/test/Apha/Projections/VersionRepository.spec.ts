
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {VersionRepository} from "../../../main/Apha/Projections/VersionRepository";
import {MemoryVersionStorage} from "../../../main/Apha/Projections/Storage/MemoryVersionStorage";

chai.use(chaiAsPromised);

describe("VersionRepository", () => {
    let repository;

    let storageMock;

    beforeEach(() => {
        const storage = new MemoryVersionStorage();
        storageMock = sinon.mock(storage);

        repository = new VersionRepository(storage);
    });

    describe("findByName", () => {
        it("should retrieve version information by name", (done) => {
            const name = "foo";
            const version = 1;

            storageMock.expects("findByName")
                .once()
                .withArgs(name)
                .returns(new Promise<number>(resolve => resolve(version)));

            expect(repository.findByName(name)).to.eventually.be.fulfilled.and.satisfy(versionInfo => {
                storageMock.verify();

                return Promise.all([
                    expect(versionInfo.name).to.equal(name),
                    expect(versionInfo.version).to.equal(version)
                ]);
            }).and.notify(done);
        });

        it("should return NULL if no version information exists for name", (done) => {
            const name = "foo";
            const version = 1;

            storageMock.expects("findByName")
                .once()
                .withArgs(name)
                .returns(new Promise<number>(resolve => resolve(null)));

            expect(repository.findByName(name)).to.eventually.be.fulfilled.and.satisfy(versionInfo => {
                storageMock.verify();
                return expect(versionInfo).to.be.null;
            }).and.notify(done);
        });
    });

    describe("updateVersion", () => {
       it("should upsert a version by name", (done) => {
           const name = "foo";
           const version = 1;

           storageMock.expects("upsert")
               .once()
               .withArgs(name, version);

           expect(repository.updateVersion(name, version)).to.eventually.be.fulfilled.and.satisfy(() => {
               storageMock.verify();
               return true;
           }).and.notify(done);
       });
    });
});
