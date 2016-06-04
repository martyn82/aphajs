
import {expect} from "chai";
import {GenericAggregateFactory} from "../../../main/Apha/Domain/GenericAggregateFactory";
import {AggregateRoot} from "../../../main/Apha/Domain/AggregateRoot";
import {Event} from "../../../main/Apha/Message/Event";

describe("GenericAggregateFactory", () => {
    describe("createAggregate", () => {
        it("constructs an aggregate instance", () => {
            const factory = new GenericAggregateFactory<GenericAggregateFactoryAggregate>(
                GenericAggregateFactoryAggregate
            );
            const events = [new GenericAggregateFactoryEvent()];

            const aggregate = factory.createAggregate(events);
            expect(aggregate).to.be.an.instanceOf(GenericAggregateFactoryAggregate);
        });
    });

    describe("getAggregateType", () => {
        it("returns the aggregate type the factory is able to construct", () => {
            const factory = new GenericAggregateFactory<GenericAggregateFactoryAggregate>(
                GenericAggregateFactoryAggregate
            );

            expect(factory.getAggregateType()).to.equal("GenericAggregateFactoryAggregate");
        });
    });
});

class GenericAggregateFactoryEvent extends Event {}
class GenericAggregateFactoryAggregate extends AggregateRoot {
    public getId(): string {
        return null;
    }

    public onGenericAggregateFactoryEvent(event: GenericAggregateFactoryEvent): void {
    }
}
