
import {SimpleCommandBus} from "./../src/main/Apha/CommandHandling/SimpleCommandBus";
import {Command} from "./../src/main/Apha/Message/Command";
import {Event} from "./../src/main/Apha/Message/Event";
import {AggregateRoot} from "./../src/main/Apha/Domain/AggregateRoot";
import {Repository} from "./../src/main/Apha/Repository/Repository";
import {EventSourcingRepository} from "./../src/main/Apha/Repository/EventSourcingRepository";
import {GenericAggregateFactory} from "./../src/main/Apha/Domain/GenericAggregateFactory";
import {EventStore} from "./../src/main/Apha/EventStore/EventStore";
import {SimpleEventBus} from "./../src/main/Apha/EventHandling/SimpleEventBus";
import {JsonSerializer} from "./../src/main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "./../src/main/Apha/EventStore/EventClassMap";
import {MemoryEventStorage} from "./../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {EventStorage} from "./../src/main/Apha/EventStore/Storage/EventStorage";
import {TypedCommandHandler} from "../src/main/Apha/CommandHandling/TypedCommandHandler";
import {TypedEventListener} from "../src/main/Apha/EventHandling/TypedEventListener";

class DemonstrateHandler extends TypedCommandHandler {
    constructor(private repository: Repository<Demonstration>) {
        super();
    }

    public handleDemonstrate(command: Demonstration.Demonstrate): void {
        console.log("received command", command);
        let aggregate;

        try {
            aggregate = this.repository.findById(command.id);
        } catch (e) {
            aggregate = new Demonstration();
        }

        aggregate.demonstrate(command);
        this.repository.store(aggregate, aggregate.getVersion());
    }
}

export class DemonstratedListener extends TypedEventListener {
    constructor(private storage: EventStorage) {
        super();
    }

    public onDemonstrated(event: Demonstration.Demonstrated): void {
        console.log("received event", event);

        let identities = this.storage.findIdentities();
        console.log("stored aggregates:", identities);

        identities.forEach((identity) => {
            let events = this.storage.find(identity);
            console.log(identity, "events:", events);
        });
    }
}

class Demonstration extends AggregateRoot {
    private id: string;
    private isDemonstrated: boolean = false;

    public getId(): string {
        return this.id;
    }

    public demonstrate(command: Demonstration.Demonstrate): void {
        if (!this.isDemonstrated) {
            this.apply(new Demonstration.Demonstrated(command.id));
        }
    }

    public onDemonstrated(event: Demonstration.Demonstrated): void {
        this.id = event.id;
        this.isDemonstrated = true;
    }
}

namespace Demonstration {
    export class Demonstrate extends Command {
        constructor(public id: string) {
            super();
        }
    }
    export class Demonstrated extends Event {
        constructor(public id: string) {
            super();
        }
    }
}

// ----

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