
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import {expect} from "chai";
import {SagaRepository} from "../../../main/Apha/Saga/SagaRepository";
import {SagaStorage} from "../../../main/Apha/Saga/Storage/SagaStorage";
import {SagaSerializer} from "../../../main/Apha/Saga/SagaSerializer";
import {Saga} from "../../../main/Apha/Saga/Saga";
import {Event} from "../../../main/Apha/Message/Event";
import {AssociationValueDescriptor} from "../../../main/Apha/Saga/Storage/AssociationValueDescriptor";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {GenericSagaFactory} from "../../../main/Apha/Saga/GenericSagaFactory";
import {AssociationValue} from "../../../main/Apha/Saga/AssociationValue";

chai.use(chaiAsPromised);

describe("SagaRepository", () => {
    let repository;
    let storageMock;

    beforeEach(() => {
        const storage = new SagaRepositorySpecSagaStorage();
        storageMock = sinon.mock(storage);

        const factory = new GenericSagaFactory();
        const serializer = new SagaSerializer(new JsonSerializer(), factory);

        repository = new SagaRepository(storage, serializer);
    });

    describe("add", () => {
        it("adds an active saga to the repository", (done) => {
            const sagaId = "id";
            const saga = new SagaRepositorySpecSaga(sagaId, new AssociationValues());
            const descriptors = AssociationValueDescriptor.fromValues(saga.getAssociationValues());

            storageMock.expects("insert")
                .once()
                .withArgs(
                    "SagaRepositorySpecSaga",
                    sagaId,
                    descriptors,
                    "{\"id\":\"id\",\"associationValues\":{\"items\":[]}}"
                )
                .returns(new Promise<void>(resolve => resolve()));

            expect(repository.add(saga)).to.eventually.be.fulfilled.and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("does not add saga to the repository if it is inactive", (done) => {
            const saga = new SagaRepositorySpecSaga("id", new AssociationValues());
            const sagaMock = sinon.mock(saga);

            sagaMock.expects("isActive").returns(false);
            storageMock.expects("insert").never();

            expect(repository.add(saga)).to.eventually.be.fulfilled.and.satisfy(() => {
                sagaMock.verify();
                storageMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("commit", () => {
        it("updates existing active saga in repository", (done) => {
            const sagaId = "id";
            const saga = new SagaRepositorySpecSaga(sagaId, new AssociationValues());
            const descriptors = AssociationValueDescriptor.fromValues(saga.getAssociationValues());

            storageMock.expects("update")
                .once()
                .withArgs(
                    "SagaRepositorySpecSaga",
                    sagaId,
                    descriptors,
                    "{\"id\":\"id\",\"associationValues\":{\"items\":[]}}"
                )
                .returns(new Promise<void>(resolve => resolve()));

            expect(repository.commit(saga)).to.eventually.be.fulfilled.and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("removes an existing saga from repository if it is inactive", (done) => {
            const sagaId = "id";
            const saga = new SagaRepositorySpecSaga(sagaId, new AssociationValues());
            const sagaMock = sinon.mock(saga);

            sagaMock.expects("isActive").returns(false);
            storageMock.expects("remove")
                .once()
                .withArgs(sagaId)
                .returns(new Promise<void>(resolve => resolve()));

            expect(repository.commit(saga)).to.eventually.be.fulfilled.and.satisfy(() => {
                sagaMock.verify();
                storageMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("find", () => {
        it("retrieves all matching saga IDs for given saga type and association value", (done) => {
            const associationValue = new AssociationValue("foo", "bar");
            const descriptor = AssociationValueDescriptor.fromValue(associationValue);

            storageMock.expects("find")
                .once()
                .withArgs(
                    "SagaRepositorySpecSaga",
                    descriptor
                )
                .returns(new Promise<void>(resolve => resolve()));

            expect(
                repository.find(SagaRepositorySpecSaga, associationValue)
            ).to.eventually.be.fulfilled.and.satisfy(() => {
                storageMock.verify();
                return true;
            }).and.notify(done);
        });
    });

    describe("load", () => {
        it("finds and deserializes a saga from repository", (done) => {
            storageMock.expects("findById")
                .once()
                .withArgs("id")
                .returns(
                    new Promise<string>(resolve => resolve("{\"id\":\"id\",\"associationValues\":{\"items\":[]}}"))
                );

            expect(repository.load("id", SagaRepositorySpecSaga)).to.eventually.be.fulfilled.and.satisfy(saga => {
                expect(saga).to.be.an.instanceOf(SagaRepositorySpecSaga);
                expect(saga.getId()).to.equal("id");

                storageMock.verify();
                return true;
            }).and.notify(done);
        });

        it("returns null if saga cannot be loaded", (done) => {
            storageMock.expects("findById").returns(new Promise<string>(resolve => resolve(null)));

            expect(repository.load("id", SagaRepositorySpecSaga)).to.eventually.be.fulfilled.and.satisfy(saga => {
                expect(saga).to.be.null;

                storageMock.verify();
                return true;
            }).and.notify(done);
        });
    });
});

class SagaRepositorySpecSaga extends Saga {
    public on(event: Event): void {
    }

    public isActive(): boolean {
        return true;
    }
}

class SagaRepositorySpecSagaStorage implements SagaStorage {
    async insert(
        sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string
    ): Promise<void> {
        return null;
    }
    async update(
        sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string
    ): Promise<void> {
        return null;
    }
    async remove(id: string): Promise<void> {
        return null;
    }
    async findById(id: string): Promise<string> {
        return null;
    }
    async find(sagaClass: string, associationValue: AssociationValueDescriptor): Promise<string[]> {
        return [];
    }
}
