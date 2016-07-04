
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
        events.add(ScenarioSpec_Event);
        events.add(ScenarioSpec_Event2);

        const factory = new GenericAggregateFactory<ScenarioSpec_AggregateRoot>(ScenarioSpec_AggregateRoot);
        const eventStore = new TraceableEventStore(
            new SimpleEventBus(),
            new MemoryEventStorage(),
            new JsonSerializer(),
            new EventClassMap(events)
        );
        const repository = new EventSourcingRepository<ScenarioSpec_AggregateRoot>(factory, eventStore);
        const commandHandler = new ScenarioSpec_CommandHandler(repository);
        const commandBus = new SimpleCommandBus();

        commandBus.registerHandler(ScenarioSpec_Command, commandHandler);
        commandBus.registerHandler(ScenarioSpec_Command2, commandHandler);

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
        const event = new ScenarioSpec_Event(aggregateId);

        expect(scenario
            .given()
            .when(new ScenarioSpec_Command(aggregateId))
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
        const event1 = new ScenarioSpec_Event(aggregateId);
        const event2 = new ScenarioSpec_Event2(aggregateId, "foo");

        expect(scenario
            .given()
            .when(new ScenarioSpec_Command(aggregateId), new ScenarioSpec_Command2(aggregateId, "foo"))
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
        const event1 = new ScenarioSpec_Event(aggregateId);
        const event2 = new ScenarioSpec_Event2(aggregateId, "foo");

        expect(scenario
            .given(event1)
            .when(new ScenarioSpec_Command2(aggregateId, "foo"))
            .then(event2)
        ).to.eventually.be.fulfilled.and.satisfy(() => {
            return Promise.all([
                expect(assertSpy.called).to.be.true,
                expect(assertSpy.calledWith([event2], [event2])).to.be.true
            ]);
        }).and.notify(done);
    });
});

class ScenarioSpec_AggregateRoot extends AggregateRoot {
    private id: string;
    private val: string;

    public getId(): string {
        return this.id;
    }

    public command(command: ScenarioSpec_Command): void {
        this.apply(new ScenarioSpec_Event(command.id));
    }

    protected onScenarioSpec_Event(event: ScenarioSpec_Event): void {
        this.id = event.id;
    }

    public command2(command: ScenarioSpec_Command2): void {
        this.apply(new ScenarioSpec_Event2(command.id, command.val));
    }

    protected onScenarioSpec_Event2(event: ScenarioSpec_Event2): void {
        this.val = event.val;
    }
}

class ScenarioSpec_CommandHandler extends TypedCommandHandler {
    constructor(private repository: Repository<ScenarioSpec_AggregateRoot>) {
        super();
    }

    public async handleScenarioSpec_Command(command: ScenarioSpec_Command): Promise<void> {
        const aggregate = new ScenarioSpec_AggregateRoot();
        aggregate.command(command);
        return this.repository.store(aggregate, aggregate.version);
    }

    public async handleScenarioSpec_Command2(command: ScenarioSpec_Command2): Promise<void> {
        const aggregate = await this.repository.findById(command.id);
        aggregate.command2(command);
        return this.repository.store(aggregate, aggregate.version);
    }
}

class ScenarioSpec_Command extends Command {
    constructor(protected _id: string) {super();}
}
class ScenarioSpec_Event extends Event {
    constructor(protected _id: string) {super();}
}

class ScenarioSpec_Command2 extends Command {
    constructor(protected _id: string, private _val: string) {super();}
    public get val(): string {return this._val;}
}
class ScenarioSpec_Event2 extends Event {
    constructor(protected _id: string, private _val: string) {super();}
    public get val(): string {return this._val;}
}
