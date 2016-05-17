
import {AnnotatedSaga} from "../../../src/main/Apha/Saga/Annotation/AnnotatedSaga";
import {Event} from "../../../src/main/Apha/Message/Event";
import {EventScheduler, TimeUnit} from "../../../src/main/Apha/Scheduling/EventScheduler";
import {CommandGateway} from "../../../src/main/Apha/CommandHandling/Gateway/CommandGateway";
import {ScheduleToken} from "../../../src/main/Apha/Scheduling/ScheduleToken";
import {Serializer} from "../../../src/main/Apha/Serialization/SerializerDecorator";
import {StartSaga} from "../../../src/main/Apha/Saga/Annotation/StartSagaDecorator";
import {SagaEventHandler} from "../../../src/main/Apha/Saga/Annotation/SagaEventHandlerDecorator";
import {ToDoItem} from "./ToDoItem";
import {EndSaga} from "../../../src/main/Apha/Saga/Annotation/EndSagaDecorator";

export class ToDoItemTimeout extends Event {
    constructor(id: string) {
        super();
        this._id = id;
    }
}

export class ToDoSaga extends AnnotatedSaga {
    @Serializer.Ignore()
    private scheduler: EventScheduler;

    @Serializer.Ignore()
    private commandGateway: CommandGateway;

    @Serializer.Serializable()
    private token: ScheduleToken;

    public setEventScheduler(scheduler: EventScheduler): void {
        this.scheduler = scheduler;
    }

    public setCommandGateway(commandGateway: CommandGateway): void {
        this.commandGateway = commandGateway;
    }

    @StartSaga()
    @SagaEventHandler({associationProperty: "id"})
    public onTodoItemCreated(event: ToDoItem.Created): void {
        console.log("saga", event);
        this.token = this.scheduler.scheduleAfter(
            event.expireSeconds,
            new ToDoItemTimeout(event.id),
            TimeUnit.Seconds
        );
    }

    @SagaEventHandler({associationProperty: "id"})
    public onToDoItemTimeout(event: ToDoItemTimeout): void {
        console.log("item timeout", event);
        this.commandGateway.send(new ToDoItem.Expire(event.id));
    }

    @EndSaga()
    @SagaEventHandler({associationProperty: "id"})
    public onToDoItemExpired(event: ToDoItem.Expired): void {
        console.log("saga", event);
        this.token = null;
    }

    @EndSaga()
    @SagaEventHandler({associationProperty: "id"})
    public onToDoItemMarkedAsDone(event: ToDoItem.MarkedAsDone): void {
        console.log("saga", event);
        this.scheduler.cancelSchedule(this.token);
    }
}
