
import {expect} from "chai";
import {AnnotatedSaga} from "../../../../main/Apha/Saga/Annotation/AnnotatedSaga";
import {SagaEventHandler} from "../../../../main/Apha/Decorators/SagaEventHandlerDecorator";
import {Event} from "../../../../main/Apha/Message/Event";

describe("AnnotatedSaga", () => {
    describe("on", () => {
        it("invokes correct handler", () => {
            let event = new AnnotatedSagaSpecEvent();
            let saga = new AnnotatedSagaSpecSaga("id");

            saga.on(event);

            expect(saga.onSomethingCalled).to.be.true;
        });
    });
});

class AnnotatedSagaSpecEvent extends Event {}
class AnnotatedSagaSpecSaga extends AnnotatedSaga {
    public onSomethingCalled: boolean = false;

    @SagaEventHandler
    public onSomething(event: AnnotatedSagaSpecEvent): void {
        this.onSomethingCalled = true;
    }
}
