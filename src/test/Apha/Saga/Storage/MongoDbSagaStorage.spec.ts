
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {Saga} from "../../../../main/Apha/Saga/Saga";
import {Event} from "../../../../main/Apha/Message/Event";
import {AssociationValues} from "../../../../main/Apha/Saga/AssociationValues";
import {AssociationValue} from "../../../../main/Apha/Saga/AssociationValue";
import {ClassNameInflector} from "../../../../main/Apha/Inflection/ClassNameInflector";
import {AssociationValueDescriptor} from "../../../../main/Apha/Saga/Storage/AssociationValueDescriptor";
import {MongoClient} from "mongodb";
import {MongoDbSagaStorage} from "../../../../main/Apha/Saga/Storage/MongoDbSagaStorage";
import {JsonSerializer} from "../../../../main/Apha/Serialization/JsonSerializer";
import {GenericSagaFactory} from "../../../../main/Apha/Saga/GenericSagaFactory";
import {SagaSerializer} from "../../../../main/Apha/Saga/SagaSerializer";

chai.use(chaiAsPromised);

describe("MongoDbSagaStorage", () => {
    let mongoDb;
    let storage;
    let serializer;

    before(done => {
        const factory = new GenericSagaFactory<MongoDbSagaStorageSpecSaga>();
        serializer = new SagaSerializer<MongoDbSagaStorageSpecSaga>(new JsonSerializer(), factory);

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
        const collection = mongoDb.collection("sagas");
        storage = new MongoDbSagaStorage(collection);
    });

    afterEach(done => {
        mongoDb.dropCollection("sagas").then(() => done(), () => done());
    });

    describe("insert", () => {
        it("inserts a saga and its associated values into storage", (done) => {
            const sagaId = "id";
            const associationValues = new AssociationValues([
                new AssociationValue("foo", "bar"),
                new AssociationValue("baz", "boo")
            ]);

            const saga = new MongoDbSagaStorageSpecSaga(sagaId, associationValues);
            const serializedSaga = serializer.serialize(saga);

            expect(storage.insert(
                ClassNameInflector.classOf(saga),
                sagaId,
                AssociationValueDescriptor.fromValues(associationValues),
                serializedSaga
            )).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findById(sagaId)).to.eventually.be.fulfilled.and.satisfy(sagaData => {
                    expect(sagaData).to.equal(serializedSaga);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("associates a saga only once for an associated value", (done) => {
            const sagaId = "id";
            const associationValues = new AssociationValues([
                new AssociationValue("foo", "bar"),
                new AssociationValue("baz", "boo")
            ]);

            const saga = new MongoDbSagaStorageSpecSaga(sagaId, associationValues);
            const serializedSaga = serializer.serialize(saga);
            const sagaClass = ClassNameInflector.classOf(saga);

            expect(Promise.all([
                expect(storage.insert(
                    sagaClass,
                    sagaId,
                    AssociationValueDescriptor.fromValues(associationValues),
                    serializedSaga
                )).to.eventually.be.fulfilled,
                expect(storage.insert(
                    sagaClass,
                    sagaId,
                    AssociationValueDescriptor.fromValues(associationValues),
                    serializedSaga
                )).to.eventually.be.rejected
            ])).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.find(sagaClass, AssociationValueDescriptor.fromValues(associationValues)))
                    .to.eventually.be.fulfilled
                    .and.satisfy(foundSagas => {
                        expect(foundSagas).to.have.lengthOf(1);
                        return true;
                }).and.notify(done);
            }, done.fail);
        });
    });

    describe("findById", () => {
        it("finds a stored saga by ID", (done) => {
            const saga = new MongoDbSagaStorageSpecSaga("id", new AssociationValues());
            const serializedSaga = serializer.serialize(saga);

            expect(storage.insert(
                ClassNameInflector.classOf(saga),
                saga.getId(),
                AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
                serializedSaga
            )).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findById(saga.getId())).to.eventually.be.fulfilled.and.satisfy(sagaData => {
                    expect(sagaData).to.equal(serializedSaga);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("returns NULL if no saga with given ID was found", (done) => {
            expect(storage.findById("id")).to.become(null).and.notify(done);
        });
    });

    describe("find", () => {
        it("retrieves sagas by type and associated values", (done) => {
            // matching saga
            const saga1 = new MongoDbSagaStorageSpecSaga("id1", new AssociationValues([
                new AssociationValue("foo", "bar")
            ]));

            // non-matching: same associationValue, but other type, at insert()
            const saga2 = new MongoDbSagaStorageSpecSaga("id2", new AssociationValues([
                new AssociationValue("foo", "bar")
            ]));

            // non-matching: other associationValue (same key)
            const saga3 = new MongoDbSagaStorageSpecSaga("id3", new AssociationValues([
                new AssociationValue("foo", "baz")
            ]));

            expect(Promise.all([
                storage.insert(
                    "SomeSaga",
                    saga1.getId(),
                    AssociationValueDescriptor.fromValues(saga1.getAssociationValues()),
                    serializer.serialize(saga1)
                ),
                storage.insert(
                    "SomeOtherSaga",
                    saga2.getId(),
                    AssociationValueDescriptor.fromValues(saga2.getAssociationValues()),
                    serializer.serialize(saga2)
                ),
                storage.insert(
                    "SomeSaga",
                    saga3.getId(),
                    AssociationValueDescriptor.fromValues(saga3.getAssociationValues()),
                    serializer.serialize(saga3)
                )
            ])).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.find("SomeSaga", AssociationValueDescriptor.fromValues(saga1.getAssociationValues())))
                    .to.eventually.be.fulfilled
                    .and.satisfy(foundSagas => {
                        expect(foundSagas).to.have.lengthOf(1);
                        expect(foundSagas[0]).to.equal(saga1.getId());
                        return true;
                }).and.notify(done);
            }, done.fail);
        });

        it("returns empty result if no sagas can be found with given type and associated values", (done) => {
            expect(storage.find("SomeSaga", AssociationValueDescriptor.fromValues(new AssociationValues([
                new AssociationValue("foo", "bar")
            ])))).to.eventually.be.fulfilled.and.satisfy(foundSagas => {
                expect(foundSagas).to.have.lengthOf(0);
                expect(foundSagas).to.eql([]);
                return true;
            }).and.notify(done);
        });
    });

    describe("remove", () => {
        it("removes a previously stored saga", (done) => {
            // to-be-removed saga
            const saga1 = new MongoDbSagaStorageSpecSaga("id1", new AssociationValues([
                new AssociationValue("foo", "bar")
            ]));

            // like-saga, different associations
            const saga2 = new MongoDbSagaStorageSpecSaga("id2", new AssociationValues([
                new AssociationValue("foo", "baz")
            ]));

            expect(Promise.all([
                storage.insert(
                    ClassNameInflector.classOf(saga1),
                    saga1.getId(),
                    AssociationValueDescriptor.fromValues(saga1.getAssociationValues()),
                    serializer.serialize(saga1)
                ),
                storage.insert(
                    ClassNameInflector.classOf(saga2),
                    saga2.getId(),
                    AssociationValueDescriptor.fromValues(saga2.getAssociationValues()),
                    serializer.serialize(saga2)
                )
            ])).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.remove(saga1.getId())).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.findById(saga1.getId())).to.become(null).and.notify(done);
                }, done.fail);
            }, done.fail);
        });

        it("is idempotent", (done) => {
            expect(storage.remove("id1")).to.eventually.be.fulfilled.and.notify(done);
        });
    });

    describe("update", () => {
        it("updates the saga", (done) => {
            const associationValue = new AssociationValue("foo", "bar");
            const associationValue2 = new AssociationValue("baz", "boo");
            let saga = new MongoDbSagaStorageSpecSaga("id", new AssociationValues([associationValue]));

            expect(storage.insert(
                "SomeSaga",
                saga.getId(),
                AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
                serializer.serialize(saga)
            )).to.eventually.be.fulfilled.and.then(() => {
                const updatedAssociationValues = new AssociationValues([associationValue, associationValue2]);
                saga = new MongoDbSagaStorageSpecSaga("id", updatedAssociationValues);

                expect(storage.update(
                    "SomeSaga",
                    saga.getId(),
                    AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
                    serializer.serialize(saga)
                )).to.eventually.be.fulfilled.and.then(() => {
                    expect(storage.findById(saga.getId())).to.eventually.be.fulfilled.and.satisfy(serializedSaga => {
                        const actualSaga = serializer.deserialize(serializedSaga, MongoDbSagaStorageSpecSaga);
                        expect(actualSaga.getAssociationValues()).to.eql(updatedAssociationValues);
                        return true;
                    }).and.notify(done);
                }, done.fail);
            }, done.fail);
        });

        it("inserts the saga if it does not exist", (done) => {
            const saga = new MongoDbSagaStorageSpecSaga("id", new AssociationValues([]));

            expect(storage.update(
                "SomeSaga",
                saga.getId(),
                AssociationValueDescriptor.fromValues(saga.getAssociationValues()),
                serializer.serialize(saga)
            )).to.eventually.be.fulfilled.and.then(() => {
                expect(storage.findById(saga.getId())).to.eventually.be.fulfilled.and.satisfy(serializedSaga => {
                    const actualSaga = serializer.deserialize(serializedSaga);
                    expect(actualSaga).to.eql(saga);
                    return true;
                }).and.notify(done);
            }, done.fail);
        });
    });
});

class MongoDbSagaStorageSpecSaga extends Saga {
    public on(event: Event): void {}

    public isActive(): boolean {
        return true;
    }
}
