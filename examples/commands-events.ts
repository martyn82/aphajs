
import {MemoryEventStorage} from "../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {SimpleEventBus} from "../src/main/Apha/EventHandling/SimpleEventBus";
import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../src/main/Apha/EventStore/EventClassMap";
import {Demonstration} from "./CommandsEvents/Domain/Demonstration";
import {DemonstratedListener} from "./CommandsEvents/Domain/DemonstratedListener";
import {DemonstrateHandler} from "./CommandsEvents/Domain/DemonstrateHandler";
import {EventStore} from "../src/main/Apha/EventStore/EventStore";
import {GenericAggregateFactory} from "../src/main/Apha/Domain/GenericAggregateFactory";
import {EventSourcingRepository} from "../src/main/Apha/Repository/EventSourcingRepository";
import {SimpleCommandBus} from "../src/main/Apha/CommandHandling/SimpleCommandBus";

let eventStorage = new MemoryEventStorage();
let eventBus = new SimpleEventBus();
eventBus.subscribe(new DemonstratedListener(eventStorage));

let serializer = new JsonSerializer();
let eventClassMap = new EventClassMap([Demonstration.Demonstrated]);
let eventStore = new EventStore(eventBus, eventStorage, serializer, eventClassMap);
let factory = new GenericAggregateFactory<Demonstration>(Demonstration);
let repository = new EventSourcingRepository<Demonstration>(factory, eventStore);

let commandBus = new SimpleCommandBus();
commandBus.registerHandler(Demonstration.Demonstrate, new DemonstrateHandler(repository));

commandBus.send(new Demonstration.Demonstrate("foo"));
