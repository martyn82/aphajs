
import {MemoryEventStorage} from "../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {SimpleEventBus} from "../src/main/Apha/EventHandling/SimpleEventBus";
import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
import {Demonstration} from "./CommandsEvents/Domain/Demonstration";
import {DemonstratedListener} from "./CommandsEvents/Domain/DemonstratedListener";
import {DemonstrateHandler} from "./CommandsEvents/Domain/DemonstrateHandler";
import {EventStore} from "../src/main/Apha/EventStore/EventStore";
import {GenericAggregateFactory} from "../src/main/Apha/Domain/GenericAggregateFactory";
import {EventSourcingRepository} from "../src/main/Apha/Repository/EventSourcingRepository";
import {SimpleCommandBus} from "../src/main/Apha/CommandHandling/SimpleCommandBus";
import {AnnotatedEventClassMap} from "../src/main/Apha/EventStore/AnnotatedEventClassMap";

async function main() {
    const eventStorage = new MemoryEventStorage();
    const eventBus = new SimpleEventBus();
    eventBus.subscribe(new DemonstratedListener(eventStorage));

    const serializer = new JsonSerializer();
    const eventClassMap = new AnnotatedEventClassMap();
    const eventStore = new EventStore(eventBus, eventStorage, serializer, eventClassMap);
    const factory = new GenericAggregateFactory<Demonstration>(Demonstration);
    const repository = new EventSourcingRepository<Demonstration>(factory, eventStore);

    const commandBus = new SimpleCommandBus();
    commandBus.registerHandler(Demonstration.Demonstrate, new DemonstrateHandler(repository));

    commandBus.send(new Demonstration.Demonstrate("foo"));
}

main();
