
import {expect} from "chai";
import {Event} from "../../../main/Apha/Message/Event";
import {DomainEvent} from "../../../main/Apha/EventStore/DomainEventDecorator";
import {AnnotatedEventClassMap} from "../../../main/Apha/EventStore/AnnotatedEventClassMap";

describe("AnnotatedEventClassMap", () => {
    it("should receive all registered domain events", () => {
        const classMap = new AnnotatedEventClassMap();
        expect(classMap.getTypeByClassName("AnnotatedEventClassMapSpecEvent")).to.equal(
            AnnotatedEventClassMapSpecEvent
        );
    });
});

@DomainEvent()
class AnnotatedEventClassMapSpecEvent extends Event {}
