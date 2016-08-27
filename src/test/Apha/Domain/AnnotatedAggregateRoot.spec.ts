
import {expect} from "chai";
import {AnnotatedAggregateRoot} from "../../../main/Apha/Domain/AnnotatedAggregateRoot";
import {Command, CommandType} from "../../../main/Apha/Message/Command";
import {CommandHandler} from "../../../main/Apha/CommandHandling/CommandHandlerDecorator";
import {EventListener} from "../../../main/Apha/EventHandling/EventListenerDecorator";
import {Event, EventType} from "../../../main/Apha/Message/Event";

describe("AnnotatedAggregateRoot", () => {
    describe("handle", () => {
        it("should delegate handling to appropriate command handler", () => {
            const command = new AnnotatedAggregateRootSpecCommand1("foo");
            const aggregate = new AnnotatedAggregateRootSpecAggregateRoot();

            aggregate.handle(command);

            expect(aggregate.getId()).to.equal("foo");
            expect(aggregate.getUncommittedChanges()).to.eql([new AnnotatedAggregateRootSpecEvent1("foo")]);
        });
    });

    describe("on", () => {
        it("should delegate handling to appropriate event handler", () => {
            const event = new AnnotatedAggregateRootSpecEvent1("foo");
            const aggregate = new AnnotatedAggregateRootSpecAggregateRoot();

            aggregate.on(event);

            expect(aggregate.getId()).to.equal("foo");
        });
    });

    describe("getSupportedEvents", () => {
        it("should return the by aggregate root supported events", () => {
            const aggregate = new AnnotatedAggregateRootSpecAggregateRoot();

            const events = new Set<EventType>();
            events.add(AnnotatedAggregateRootSpecEvent1);

            expect(aggregate.getSupportedEvents()).to.eql(events);
        });
    });

    describe("getSupportedCommands", () => {
        it("should return the by aggregate root supported commands", () => {
            const aggregate = new AnnotatedAggregateRootSpecAggregateRoot();

            const commands = new Set<CommandType>();
            commands.add(AnnotatedAggregateRootSpecCommand1);

            expect(aggregate.getSupportedCommands()).to.eql(commands);
        });
    });
});

class AnnotatedAggregateRootSpecCommand1 extends Command {
    constructor(protected _id: string) {
        super();
    }
}
class AnnotatedAggregateRootSpecEvent1 extends Event {
    constructor(protected _id: string) {
        super();
    }
}

class AnnotatedAggregateRootSpecAggregateRoot extends AnnotatedAggregateRoot {
    private _id: string;

    @CommandHandler()
    public doCommand1(command: AnnotatedAggregateRootSpecCommand1) {
        this.apply(new AnnotatedAggregateRootSpecEvent1(command.id));
    }

    @EventListener()
    public command1Done(event: AnnotatedAggregateRootSpecEvent1) {
        this._id = event.id;
    }

    public getId(): string {
        return this._id;
    }
}
