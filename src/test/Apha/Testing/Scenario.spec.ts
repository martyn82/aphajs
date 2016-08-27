
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
import {Scenario} from "../../../main/Apha/Testing/Scenario";
import {GenericAggregateFactory} from "../../../main/Apha/Domain/GenericAggregateFactory";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {TraceableEventStore} from "../../../main/Apha/Testing/TraceableEventStore";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {Command} from "../../../main/Apha/Message/Command";
import {Event, EventType} from "../../../main/Apha/Message/Event";
import {Repository} from "../../../main/Apha/Repository/Repository";
import {EventSourcingRepository} from "../../../main/Apha/Repository/EventSourcingRepository";
import {TypedCommandHandler} from "../../../main/Apha/CommandHandling/TypedCommandHandler";
import {SimpleCommandBus} from "../../../main/Apha/CommandHandling/SimpleCommandBus";

chai.use(chaiAsPromised);

describe("Scenario", () => {
    let scenario;
    let assertSpy;

    beforeEach(() => {
        const events = new Set<EventType>();
        events.add(ScenarioSpecEvent);
        events.add(ScenarioSpecEvent2);

        const factory = new GenericAggregateFactory<ScenarioSpecAggregateRoot>(ScenarioSpecAggregateRoot);
        const eventStore = new TraceableEventStore(
            new SimpleEventBus(),
            new MemoryEventStorage(),
            new JsonSerializer(),
            new EventClassMap(events)
        );
        const repository = new EventSourcingRepository<ScenarioSpecAggregateRoot>(factory, eventStore);
        const commandHandler = new ScenarioSpecCommandHandler(repository);
        const commandBus = new SimpleCommandBus();

        commandBus.registerHandler(ScenarioSpecCommand, commandHandler);
        commandBus.registerHandler(ScenarioSpecCommand2, commandHandler);

        assertSpy = sinon.spy();
        scenario = new Scenario(factory, eventStore, commandBus, assertSpy);
    });

    it("should assert empty events; given nothing, when nothing, then nothing", (done) => {
        expect(scenario
            .given()
            .when()
            .then()
        ).to.eventually.be.fulfilled.and.satisfy(() => {
            return Promise.all([
                expect(assertSpy.called).to.be.true,
                expect(assertSpy.calledWith([], [])).to.be.true
            ]);
        }).and.notify(done);
    });

    it("should assert a single resulting event, given nothing", (done) => {
        const aggregateId = "id";
        const event = new ScenarioSpecEvent(aggregateId);

        expect(scenario
            .given()
            .when(new ScenarioSpecCommand(aggregateId))
            .then(event)
        ).to.eventually.be.fulfilled.and.satisfy(() => {
            return Promise.all([
                expect(assertSpy.called).to.be.true,
                expect(assertSpy.calledWith([event], [event])).to.be.true
            ]);
        }).and.notify(done);
    });

    it("should assert multiple events in the right order", (done) => {
        const aggregateId = "id";
        const event1 = new ScenarioSpecEvent(aggregateId);
        const event2 = new ScenarioSpecEvent2(aggregateId, "foo");

        expect(scenario
            .given()
            .when(new ScenarioSpecCommand(aggregateId), new ScenarioSpecCommand2(aggregateId, "foo"))
            .then(event1, event2)
        ).to.eventually.be.fulfilled.and.satisfy(() => {
            return Promise.all([
                expect(assertSpy.called).to.be.true,
                expect(assertSpy.calledWith([event1, event2], [event1, event2])).to.be.true
            ]);
        }).and.notify(done);
    });

    it("should assert events given an initial arrangement", (done) => {
        const aggregateId = "id";
        const event1 = new ScenarioSpecEvent(aggregateId);
        const event2 = new ScenarioSpecEvent2(aggregateId, "foo");

        expect(scenario
            .given(event1)
            .when(new ScenarioSpecCommand2(aggregateId, "foo"))
            .then(event2)
        ).to.eventually.be.fulfilled.and.satisfy(() => {
            return Promise.all([
                expect(assertSpy.called).to.be.true,
                expect(assertSpy.calledWith([event2], [event2])).to.be.true
            ]);
        }).and.notify(done);
    });
});

class ScenarioSpecAggregateRoot extends AggregateRoot {
    private id: string;
    private val: string;

    public getId(): string {
        return this.id;
    }

    public command(command: ScenarioSpecCommand): void {
        this.apply(new ScenarioSpecEvent(command.id));
    }

    protected onScenarioSpecEvent(event: ScenarioSpecEvent): void {
        this.id = event.id;
    }

    public command2(command: ScenarioSpecCommand2): void {
        this.apply(new ScenarioSpecEvent2(command.id, command.val));
    }

    protected onScenarioSpecEvent2(event: ScenarioSpecEvent2): void {
        this.val = event.val;
    }
}

class ScenarioSpecCommandHandler extends TypedCommandHandler {
    constructor(private repository: Repository<ScenarioSpecAggregateRoot>) {
        super();
    }

    public async handleScenarioSpecCommand(command: ScenarioSpecCommand): Promise<void> {
        const aggregate = new ScenarioSpecAggregateRoot();
        aggregate.command(command);
        return this.repository.store(aggregate, aggregate.version);
    }

    public async handleScenarioSpecCommand2(command: ScenarioSpecCommand2): Promise<void> {
        const aggregate = await this.repository.findById(command.id);
        aggregate.command2(command);
        return this.repository.store(aggregate, aggregate.version);
    }
}

class ScenarioSpecCommand extends Command {
    constructor(protected _id: string) {
        super();
    }
}
class ScenarioSpecEvent extends Event {
    constructor(protected _id: string) {
        super();
    }
}

class ScenarioSpecCommand2 extends Command {
    constructor(protected _id: string, private _val: string) {
        super();
    }
    public get val(): string {
        return this._val;
    }
}
class ScenarioSpecEvent2 extends Event {
    constructor(protected _id: string, private _val: string) {
        super();
    }
    public get val(): string {
        return this._val;
    }
}
