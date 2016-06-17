
import * as sinon from "sinon";
import {expect} from "chai";
import {VersionRepository} from "../../../main/Apha/Projections/VersionRepository";
import {MemoryVersionStorage} from "../../../main/Apha/Projections/Storage/MemoryVersionStorage";

describe("VersionRepository", () => {
    let repository;

    let storageMock;

    beforeEach(() => {
        const storage = new MemoryVersionStorage();
        storageMock = sinon.mock(storage);

        repository = new VersionRepository(storage);
    });

    describe("findByName", () => {
        it("should retrieve version information by name", () => {
            const name = "foo";
            const version = 1;

            storageMock.expects("findByName")
                .once()
                .withArgs(name)
                .returns(version);

            const versionInfo = repository.findByName(name);

            expect(versionInfo.name).to.equal(name);
            expect(versionInfo.version).to.equal(version);

            storageMock.verify();
        });

        it("should return NULL if no version information exists for name", () => {
            const name = "foo";
            const version = 1;

            storageMock.expects("findByName")
                .once()
                .withArgs(name)
                .returns(null);

            const versionInfo = repository.findByName(name);
            expect(versionInfo).to.be.null;

            storageMock.verify();
        });
    });

    describe("updateVersion", () => {
       it("should upsert a version by name", () => {
           const name = "foo";
           const version = 1;

           storageMock.expects("upsert")
               .once()
               .withArgs(name, version);

           repository.updateVersion(name, version);

           storageMock.verify();
       });
    });
});
