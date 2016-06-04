
import * as sinon from "sinon";
import {expect} from "chai";
import {Saga} from "../../../main/Apha/Saga/Saga";
import {Event} from "../../../main/Apha/Message/Event";
import {GenericSagaFactory} from "../../../main/Apha/Saga/GenericSagaFactory";
import {AssociationValues} from "../../../main/Apha/Saga/AssociationValues";
import {UnsupportedSagaException} from "../../../main/Apha/Saga/UnsupportedSagaException";

describe("GenericSagaFactory", () => {
    let factory;

    beforeEach(() => {
        factory = new GenericSagaFactory<Saga>();
    });

    describe("createSaga", () => {
        it("creates a saga of given type", () => {
            const saga = factory.createSaga(GenericSagaFactorySpecSaga, "id", new AssociationValues());

            expect(saga instanceof GenericSagaFactorySpecSaga).to.be.true;
        });

        it("throws exception for unsupported saga type", () => {
            const factory = new GenericSagaFactory<GenericSagaFactorySpecSaga>();
            const factoryMock = sinon.mock(factory);

            factoryMock.expects("supports")
                .once()
                .withArgs(GenericSagaFactorySpecSaga2)
                .returns(false);

            expect(() => {
                factory.createSaga(GenericSagaFactorySpecSaga2, "id", new AssociationValues());
            }).to.throw(UnsupportedSagaException);
        });
    });

    describe("hydrate", () => {
       it("has no operation", () => {
           const saga = new GenericSagaFactorySpecSaga("id", new AssociationValues());
           factory.hydrate(saga);

           expect(saga.getId()).to.equal("id");
           expect(saga.getAssociationValues()).to.eql(new AssociationValues());
       });
    });
});

class GenericSagaFactorySpecSaga extends Saga {
    public on(event: Event): void {}
    public isActive(): boolean {
        return true;
    }
}

class GenericSagaFactorySpecSaga2 extends Saga {
    public on(event: Event): void {}
    public isActive(): boolean {
        return true;
    }
}
