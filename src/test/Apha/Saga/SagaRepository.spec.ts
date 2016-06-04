
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
        it("adds an active saga to the repository", () => {
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
                );

            repository.add(saga);

            storageMock.verify();
        });

        it("does not add saga to the repository if it is inactive", () => {
            const saga = new SagaRepositorySpecSaga("id", new AssociationValues());
            const sagaMock = sinon.mock(saga);

            sagaMock.expects("isActive").returns(false);
            storageMock.expects("insert").never();

            repository.add(saga);

            storageMock.verify();
        });
    });

    describe("commit", () => {
        it("updates existing active saga in repository", () => {
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
                );

            repository.commit(saga);

            storageMock.verify();
        });

        it("removes an existing saga from repository if it is inactive", () => {
            const sagaId = "id";
            const saga = new SagaRepositorySpecSaga(sagaId, new AssociationValues());
            const sagaMock = sinon.mock(saga);

            sagaMock.expects("isActive").returns(false);
            storageMock.expects("remove")
                .once()
                .withArgs(sagaId);

            repository.commit(saga);

            storageMock.verify();
        });
    });

    describe("find", () => {
        it("retrieves all matching saga IDs for given saga type and association value", () => {
            const associationValue = new AssociationValue("foo", "bar");
            const descriptor = AssociationValueDescriptor.fromValue(associationValue);

            storageMock.expects("find")
                .once()
                .withArgs(
                    "SagaRepositorySpecSaga",
                    descriptor
                );

            repository.find(SagaRepositorySpecSaga, associationValue);

            storageMock.verify();
        });
    });

    describe("load", () => {
        it("finds and deserializes a saga from repository", () => {
            storageMock.expects("findById")
                .once()
                .withArgs("id")
                .returns("{\"id\":\"id\",\"associationValues\":{\"items\":[]}}");

            const saga = repository.load("id", SagaRepositorySpecSaga);

            expect(saga).to.be.an.instanceOf(SagaRepositorySpecSaga);
            expect(saga.getId()).to.equal("id");

            storageMock.verify();
        });

        it("returns null if saga cannot be loaded", () => {
            storageMock.expects("findById").returns(null);

            const saga = repository.load("id", SagaRepositorySpecSaga);
            expect(saga).to.be.null;

            storageMock.verify();
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
    insert(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void {}
    update(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void {}
    remove(id: string): void {}
    findById(id: string): string {
        return null;
    }
    find(sagaClass: string, associationValue: AssociationValueDescriptor): string[] {
        return [];
    }
}
