
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

const commandBus = new SimpleCommandBus();
const eventBus = new SimpleEventBus();

const resolver = new SimpleAssociationValueResolver();
const scheduleStorage = new MemoryScheduleStorage();
const scheduler = new SimpleEventScheduler(scheduleStorage, eventBus);
const commandGateway = new DefaultCommandGateway(commandBus);

const sagaFactory = new ToDoSagaFactory(
    scheduler,
    commandGateway,
    new DefaultParameterResolver()
);

const sagaSerializer = new SagaSerializer<ToDoSaga>(new JsonSerializer(), sagaFactory);
const sagaRepository = new SagaRepository<ToDoSaga>(
    new MemorySagaStorage(),
    sagaSerializer
);

const sagaManager = new SimpleSagaManager<ToDoSaga>([ToDoSaga], sagaRepository, resolver, sagaFactory);
const eventClassMap = new EventClassMap([
    ToDoItemTimeout,
    ToDoItem.Created,
    ToDoItem.MarkedAsDone,
    ToDoItem.Expired
]);

const eventStorage = new MemoryEventStorage();
const eventStore = new EventStore(eventBus, eventStorage, new JsonSerializer(), eventClassMap);
const factory = new GenericAggregateFactory<ToDoItem>(ToDoItem);
const repository = new EventSourcingRepository<ToDoItem>(factory, eventStore);
const toDoItemCommandHandler = new ToDoItemCommandHandler(repository);

try {
    eventBus.subscribe(sagaManager);

    commandBus.registerHandler(ToDoItem.Create, toDoItemCommandHandler);
    commandBus.registerHandler(ToDoItem.MarkAsDone, toDoItemCommandHandler);
    commandBus.registerHandler(ToDoItem.Expire, toDoItemCommandHandler);

    const firstId = IdentityProvider.generateNew();
    const secondId = IdentityProvider.generateNew();

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
