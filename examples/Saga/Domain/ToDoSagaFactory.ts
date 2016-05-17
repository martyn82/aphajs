
import {AnnotatedSagaFactory} from "../../../src/main/Apha/Saga/Annotation/AnnotatedSagaFactory";
import {ToDoSaga} from "./ToDoSaga";
import {EventScheduler} from "../../../src/main/Apha/Scheduling/EventScheduler";
import {CommandGateway} from "../../../src/main/Apha/CommandHandling/Gateway/CommandGateway";
import {ParameterResolver} from "../../../src/main/Apha/Saga/Annotation/ParameterResolver";

export class ToDoSagaFactory extends AnnotatedSagaFactory<ToDoSaga> {
    constructor(
        private scheduler: EventScheduler,
        private commandGateway: CommandGateway,
        parameterResolver: ParameterResolver
    ) {
        super(parameterResolver);
    }

    public hydrate(saga: ToDoSaga): void {
        super.hydrate(saga);
        saga.setCommandGateway(this.commandGateway);
        saga.setEventScheduler(this.scheduler);
    }

    public dehydrate(saga: ToDoSaga): void {
        super.dehydrate(saga);
        saga.setCommandGateway(null);
        saga.setEventScheduler(null);
    }
}
