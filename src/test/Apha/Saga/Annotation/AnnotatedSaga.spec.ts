
import {expect} from "chai";
import {AnnotatedSaga} from "../../../../main/Apha/Saga/Annotation/AnnotatedSaga";
import {SagaEventHandler} from "../../../../main/Apha/Saga/Annotation/SagaEventHandlerDecorator";
import {Event} from "../../../../main/Apha/Message/Event";
import {StartSaga} from "../../../../main/Apha/Saga/Annotation/StartSagaDecorator";
import {EndSaga} from "../../../../main/Apha/Saga/Annotation/EndSagaDecorator";
import {DefaultParameterResolver} from "./../../../../main/Apha/Saga/Annotation/DefaultParameterResolver";

describe("AnnotatedSaga", () => {
    describe("on", () => {
        it("invokes correct handler", () => {
            let event = new AnnotatedSagaSpecEvent();
            let saga = new AnnotatedSagaSpecSaga("id");
            saga.setActive();
            saga.setParameterResolver(new DefaultParameterResolver());

            saga.on(event);

            expect(saga.onSomethingCalled).to.be.true;
        });

        it("starts saga if handler is supposed to", () => {
            let event = new AnnotatedSagaSpecEventStart();
            let saga = new AnnotatedSagaSpecSaga("id");
            saga.setParameterResolver(new DefaultParameterResolver());

            saga.on(event);

            expect(saga.isActive()).to.be.true;
        });

        it("ends saga if handler is supposed to", () => {
            let event = new AnnotatedSagaSpecEventEnd();
            let saga = new AnnotatedSagaSpecSaga("id");
            saga.setParameterResolver(new DefaultParameterResolver());

            saga.on(event);

            expect(saga.isActive()).to.be.false;
        });
    });
});

class AnnotatedSagaSpecEvent extends Event {}
class AnnotatedSagaSpecEventStart extends Event {}
class AnnotatedSagaSpecEventEnd extends Event {}

class AnnotatedSagaSpecSaga extends AnnotatedSaga {
    public onSomethingCalled: boolean = false;

    public setActive(): void {
        this.start();
    }

    @StartSaga
    @SagaEventHandler()
    public onStart(event: AnnotatedSagaSpecEventStart): void {
    }

    @SagaEventHandler()
    public onSomething(event: AnnotatedSagaSpecEvent): void {
        this.onSomethingCalled = true;
    }

    @EndSaga
    @SagaEventHandler()
    public onEnd(event: AnnotatedSagaSpecEventEnd): void {
    }
}
