
import {expect} from "chai";

import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Command} from "../../../main/Apha/Message/Command";
import {Event} from "../../../main/Apha/Message/Event";
import {UnsupportedEventException} from "../../../main/Apha/Domain/UnsupportedEventException";

describe("AggregateRoot", () => {
    let aggregate;

    beforeEach(() => {
        aggregate = new AggregateRootTest();
    });

    describe("getUncommittedChanges", () => {
        it("retrieves uncommitted events", () => {
            let events = [
                new AggregateRootTest.Created()
            ];
            aggregate.hydrateWithChanges(events);
            expect(aggregate.getUncommittedChanges()).to.eql(events);
        });
    });

    describe("markChangesCommitted", () => {
        it("clears event log", () => {
            aggregate.hydrateWithChanges([
                new AggregateRootTest.Created()
            ]);
            aggregate.markChangesCommitted();
            expect(aggregate.getUncommittedChanges()).to.eql([]);
        });
    });

    describe("loadFromHistory", () => {
        it("hydrates the aggregate with non-changing events", () => {
            let events = [
                new AggregateRootTest.Created()
            ];

            expect(aggregate.exists).to.equal(false);

            aggregate.loadFromHistory(events);

            expect(aggregate.getUncommittedChanges()).to.eql([]);
            expect(aggregate.exists).to.equal(true);
        });
    });

    describe("events", () => {
        it("are handled by appropriate handler", () => {
            expect(aggregate.exists).to.equal(false);

            aggregate.create(new AggregateRootTest.Create());
            expect(aggregate.exists).to.equal(true);

            aggregate.destroy(new AggregateRootTest.Destroy());
            expect(aggregate.exists).to.equal(false);
        });

        it("without proper handler will throw an exception", () => {
            expect(() => {
                aggregate.on(new AggregateRootTest.Unsupported());
            }).to.throw(UnsupportedEventException);
        });
    });

    describe("getVersion", () => {
        it("returns the aggregate version", () => {
            expect(aggregate.getVersion()).to.equal(-1);
        });
    });
});

class AggregateRootTest extends AggregateRoot {
    public exists: boolean = false;

    public hydrateWithChanges(events: Event[]): void {
        events.forEach((event) => {
            this.apply(event);
        });
    }

    public getId(): string {
        return "";
    }

    public on(event: Event): void {
        super.on(event);
    }

    public create(command: AggregateRootTest.Create): void {
        if (!this.exists) {
            this.apply(new AggregateRootTest.Created());
        }
    }

    public destroy(command: AggregateRootTest.Destroy): void {
        if (this.exists) {
            this.apply(new AggregateRootTest.Destroyed());
        }
    }

    public onCreated(event: AggregateRootTest.Created): void {
        this.exists = true;
    }

    public onDestroyed(event: AggregateRootTest.Destroyed): void {
        this.exists = false;
    }
}

namespace AggregateRootTest {
    export class Create extends Command {}
    export class Created extends Event {}

    export class Destroy extends Command {}
    export class Destroyed extends Event {}

    export class Unsupported extends Event {}
}
