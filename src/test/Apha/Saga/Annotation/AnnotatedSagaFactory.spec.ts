
import * as sinon from "sinon";
import {expect} from "chai";
import {AnnotatedSaga} from "../../../../main/Apha/Saga/Annotation/AnnotatedSaga";
import {AnnotatedSagaFactory} from "../../../../main/Apha/Saga/Annotation/AnnotatedSagaFactory";
import {UnsupportedSagaException} from "../../../../main/Apha/Saga/UnsupportedSagaException";
import {AssociationValues} from "../../../../main/Apha/Saga/AssociationValues";
import {ParameterResolver} from "./../../../../main/Apha/Saga/Annotation/ParameterResolver";
import {DefaultParameterResolver} from "./../../../../main/Apha/Saga/Annotation/DefaultParameterResolver";
import {AssociationValue} from "../../../../main/Apha/Saga/AssociationValue";

describe("AnnotatedSagaFactory", () => {
    let factory;
    let parameterResolver;

    beforeEach(() => {
        parameterResolver = new DefaultParameterResolver();
        factory = new AnnotatedSagaFactory<AnnotatedSaga>(parameterResolver);
    });

    describe("createSaga", () => {
        it("creates a saga of given type", () => {
            let saga = factory.createSaga(AnnotatedSagaFactorySpecSaga, "id", new AssociationValues([
                new AssociationValue("foo", "bar")
            ]));

            expect(saga instanceof AnnotatedSagaFactorySpecSaga).to.be.true;
        });

        it("throws exception for unsupported saga type", () => {
            let factory = new AnnotatedSagaFactory<AnnotatedSagaFactorySpecSaga>(parameterResolver);
            let factoryMock = sinon.mock(factory);

            factoryMock.expects("supports")
                .once()
                .withArgs(AnnotatedSagaFactorySpecSaga2)
                .returns(false);

            expect(() => {
                factory.createSaga(AnnotatedSagaFactorySpecSaga2, "id", new AssociationValues());
            }).to.throw(UnsupportedSagaException);
        });
    });

    describe("hydrate", () => {
        it("hydrates the saga", () => {
            let saga = new AnnotatedSagaFactorySpecSaga("id");
            factory.hydrate(saga);

            expect(saga.getId()).to.equal("id");
            expect(saga.getAssociationValues()).to.eql(new AssociationValues());
            expect(saga.getParameterResolver()).to.eql(parameterResolver);
        });
    });

    describe("dehydrate", () => {
        it("dehydrates the saga", () => {
            let saga = new AnnotatedSagaFactorySpecSaga("id");
            saga.setParameterResolver(parameterResolver);

            factory.dehydrate(saga);
            expect(saga.getParameterResolver()).to.be.null;
        });
    });
});

class AnnotatedSagaFactorySpecSaga extends AnnotatedSaga {
    public getParameterResolver(): ParameterResolver {
        return this.parameterResolver;
    }
}
class AnnotatedSagaFactorySpecSaga2 extends AnnotatedSaga {
    public getParameterResolver(): ParameterResolver {
        return this.parameterResolver;
    }
}
