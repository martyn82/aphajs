
import {expect} from "chai";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Command} from "../../../main/Apha/Message/Command";
import {Event} from "../../../main/Apha/Message/Event";
import {Message} from "../../../main/Apha/Message/Message";
import {AggregateRootInitializer} from "../../../main/Apha/Domain/AggregateRootInitializer";

describe("Message", () => {
    beforeEach(() => {
        AggregateRootInitializer.reset();
    });

    describe("fqn", () => {
        it("should return the fully qualified name of the messagetype given", () => {
            AggregateRootInitializer.initialize(Foo);

            expect(Message.fqn(Foo.SomeCommand)).to.equal("Foo$SomeCommand");
            expect(Message.fqn(Foo.SomeEvent)).to.equal("Foo$SomeEvent");
        });
    });
});

class Foo extends AggregateRoot {
    public getId(): string {
        return "id";
    }
}

namespace Foo {
    export class SomeCommand extends Command {
        constructor(protected _id: string) {
            super();
        }
    }
    export class SomeEvent extends Event {
        constructor(protected _id: string) {
            super();
        }
    }
}
