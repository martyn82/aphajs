
import {AnnotatedSaga} from "../src/main/Apha/Saga/Annotation/AnnotatedSaga";
import {SagaEventHandler} from "../src/main/Apha/Saga/Annotation/SagaEventHandlerDecorator";
import {StartSaga} from "../src/main/Apha/Saga/Annotation/StartSagaDecorator";
import {Event} from "../src/main/Apha/Message/Event";
import {Command} from "../src/main/Apha/Message/Command";
import {AggregateRoot} from "../src/main/Apha/Domain/AggregateRoot";
import {EndSaga} from "../src/main/Apha/Saga/Annotation/EndSagaDecorator";
import {EventScheduler, TimeUnit} from "../src/main/Apha/Scheduling/EventScheduler";
import {ScheduleToken} from "../src/main/Apha/Scheduling/ScheduleToken";
import {DefaultCommandGateway} from "../src/main/Apha/CommandHandling/Gateway/DefaultCommandGateway";
import {SimpleCommandBus} from "../src/main/Apha/CommandHandling/SimpleCommandBus";
import {AnnotatedCommandHandler} from "../src/main/Apha/CommandHandling/AnnotatedCommandHandler";
import {EventSourcingRepository} from "../src/main/Apha/Repository/EventSourcingRepository";
import {GenericAggregateFactory} from "../src/main/Apha/Domain/GenericAggregateFactory";
import {EventStore} from "../src/main/Apha/EventStore/EventStore";
import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
import {SimpleEventBus} from "../src/main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {EventClassMap} from "../src/main/Apha/EventStore/EventClassMap";
import {SimpleSagaManager} from "../src/main/Apha/Saga/SimpleSagaManager";
import {SagaRepository} from "../src/main/Apha/Saga/SagaRepository";
import {SagaSerializer} from "../src/main/Apha/Saga/SagaSerializer";
import {MemorySagaStorage} from "../src/main/Apha/Saga/Storage/MemorySagaStorage";
import {IdentityProvider} from "../src/main/Apha/Domain/IdentityProvider";
import {CommandHandler} from "../src/main/Apha/CommandHandling/CommandHandlerDecorator";
import {SimpleAssociationValueResolver} from "../src/main/Apha/Saga/Annotation/SimpleAssociationValueResolver";
import {SimpleEventScheduler} from "../src/main/Apha/Scheduling/SimpleEventScheduler";
import {MemoryScheduleStorage} from "../src/main/Apha/Scheduling/Storage/MemoryScheduleStorage";
import {AnnotatedSagaFactory} from "../src/main/Apha/Saga/Annotation/AnnotatedSagaFactory";
import {ParameterResolver} from "../src/main/Apha/Saga/Annotation/ParameterResolver";
import {DefaultParameterResolver} from "../src/main/Apha/Saga/Annotation/DefaultParameterResolver";
import {CommandGateway} from "../src/main/Apha/CommandHandling/Gateway/CommandGateway";
import {Serializer} from "../src/main/Apha/Serialization/SerializerDecorator";

export class ToDoItem extends AggregateRoot {
    private id: string;
    private description: string;
    private expireSeconds: number;
    private isDone: boolean;

    public getId(): string {
        return this.id;
    }

    public create(command: ToDoItem.Create): void {
        this.apply(new ToDoItem.Created(command.id, command.description, command.expireSeconds));
    }

    public onCreated(event: ToDoItem.Created): void {
        this.id = event.id;
        this.description = event.description;
        this.expireSeconds = event.expireSeconds;
        this.isDone = false;
    }

    public markAsDone(command: ToDoItem.MarkAsDone): void {
        if (!this.isDone) {
            this.apply(new ToDoItem.MarkedAsDone(command.id));
        }
    }

    public onMarkedAsDone(event: ToDoItem.MarkedAsDone): void {
        this.isDone = true;
    }

    public expire(command: ToDoItem.Expire): void {
        if (!this.isDone) {
            this.apply(new ToDoItem.Expired(command.id));
        }
    }

    public onExpired(event: ToDoItem.Expired): void {
        this.isDone = true;
    }
}

export namespace ToDoItem {
    export class Create extends Command {
        constructor(private _id: string, private _description: string, private _expireSeconds: number) {
            super();
        }

        public get id(): string {
            return this._id;
        }

        public get description(): string {
            return this._description;
        }

        public get expireSeconds(): number {
            return this._expireSeconds;
        }
    }
    export class Created extends Event {
        constructor(id: string, private _description: string, private _expireSeconds: number) {
            super();
            this._id = id;
        }

        public get description(): string {
            return this._description;
        }

        public get expireSeconds(): number {
            return this._expireSeconds;
        }
    }

    export class MarkAsDone extends Command {
        constructor(private _id: string) {
            super();
        }

        public get id(): string {
            return this._id;
        }
    }
    export class MarkedAsDone extends Event {
        constructor(id: string) {
            super();
            this._id = id;
        }
    }

    export class Expire extends Command {
        constructor(private _id: string) {
            super();
        }

        public get id(): string {
            return this._id;
        }
    }
    export class Expired extends Event {
        constructor(id: string) {
            super();
            this._id = id;
        }
    }
}

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

export class ToDoItemCommandHandler extends AnnotatedCommandHandler {
    constructor(private repository: EventSourcingRepository<ToDoItem>) {
        super();
    }

    @CommandHandler()
    public handleCreateToDoItem(command: ToDoItem.Create): void {
        let item = new ToDoItem();
        item.create(command);
        this.repository.store(item, item.version);
    }

    @CommandHandler()
    public handleMarkItemAsDone(command: ToDoItem.MarkAsDone): void {
        let item = this.repository.findById(command.id);
        item.markAsDone(command);
        this.repository.store(item, item.version);
    }

    @CommandHandler()
    public handleExpire(command: ToDoItem.Expire): void {
        let item = this.repository.findById(command.id);
        item.expire(command);
        this.repository.store(item, item.version);
    }
}

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

let commandBus = new SimpleCommandBus();
let eventBus = new SimpleEventBus();

let resolver = new SimpleAssociationValueResolver();
let scheduleStorage = new MemoryScheduleStorage();
let scheduler = new SimpleEventScheduler(scheduleStorage, eventBus);
let commandGateway = new DefaultCommandGateway(commandBus);

let sagaFactory = new ToDoSagaFactory(
    scheduler,
    commandGateway,
    new DefaultParameterResolver()
);

let sagaSerializer = new SagaSerializer<ToDoSaga>(new JsonSerializer(), sagaFactory);
let sagaRepository = new SagaRepository<ToDoSaga>(
    new MemorySagaStorage(),
    sagaSerializer
);

let sagaManager = new SimpleSagaManager<ToDoSaga>([ToDoSaga], sagaRepository, resolver, sagaFactory);
let eventClassMap = new EventClassMap([
    ToDoItemTimeout,
    ToDoItem.Created,
    ToDoItem.MarkedAsDone,
    ToDoItem.Expired
]);

let eventStorage = new MemoryEventStorage();
let eventStore = new EventStore(eventBus, eventStorage, new JsonSerializer(), eventClassMap);
let factory = new GenericAggregateFactory<ToDoItem>(ToDoItem);
let repository = new EventSourcingRepository<ToDoItem>(factory, eventStore);
let toDoItemCommandHandler = new ToDoItemCommandHandler(repository);

try {
    eventBus.subscribe(sagaManager);

    commandBus.registerHandler(ToDoItem.Create, toDoItemCommandHandler);
    commandBus.registerHandler(ToDoItem.MarkAsDone, toDoItemCommandHandler);
    commandBus.registerHandler(ToDoItem.Expire, toDoItemCommandHandler);

    let firstId = IdentityProvider.generateNew();
    let secondId = IdentityProvider.generateNew();

    setTimeout((commandGateway, firstId) => {
        commandGateway.send(new ToDoItem.MarkAsDone(firstId));
    }, 1000, commandGateway, firstId);

    commandGateway.send(new ToDoItem.Create(firstId, "My first todo item", 4));
    commandGateway.send(new ToDoItem.Create(secondId, "My second todo item", 4));
} catch (e) {
    console.error(e);
} finally {
    setTimeout((scheduler) => {
        scheduler.destroy();
    }, 5000, scheduler);
}
