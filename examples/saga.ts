
import {DefaultCommandGateway} from "../src/main/Apha/CommandHandling/Gateway/DefaultCommandGateway";
import {SimpleCommandBus} from "../src/main/Apha/CommandHandling/SimpleCommandBus";
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
import {SimpleAssociationValueResolver} from "../src/main/Apha/Saga/Annotation/SimpleAssociationValueResolver";
import {SimpleEventScheduler} from "../src/main/Apha/Scheduling/SimpleEventScheduler";
import {MemoryScheduleStorage} from "../src/main/Apha/Scheduling/Storage/MemoryScheduleStorage";
import {DefaultParameterResolver} from "../src/main/Apha/Saga/Annotation/DefaultParameterResolver";
import {ToDoSagaFactory} from "./Saga/Domain/ToDoSagaFactory";
import {ToDoSaga, ToDoItemTimeout} from "./Saga/Domain/ToDoSaga";
import {ToDoItem} from "./Saga/Domain/ToDoItem";
import {ToDoItemCommandHandler} from "./Saga/Domain/ToDoItemCommandHandler";

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
