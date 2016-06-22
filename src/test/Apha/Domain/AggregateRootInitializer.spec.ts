
import {expect} from "chai";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Command} from "../../../main/Apha/Message/Command";
import {Event} from "../../../main/Apha/Message/Event";
import {AggregateRootInitializer} from "../../../main/Apha/Domain/AggregateRootInitializer";

describe("AggregateRootInitializer", () => {
    let initializer;

    beforeEach(() => {
        initializer = new AggregateRootInitializer();
    });

    describe("initialize", () => {
        it("should annotate aggregate root messages with their fully qualified name", () => {
            initializer.initialize(Foo);

            const command = new Foo.SomeCommand();
            expect(command.fullyQualifiedName).to.equal("Foo$SomeCommand");

            const event = new Foo.SomeEvent();
            expect(event.fullyQualifiedName).to.equal("Foo$SomeEvent");
        });
    });
});

class Foo extends AggregateRoot {
    public getId(): string {
        return "id";
    }
}

namespace Foo {
    export class SomeCommand extends Command {}
    export class SomeEvent extends Event {}
}
