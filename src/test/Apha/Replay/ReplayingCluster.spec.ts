
import * as sinon from "sinon";
import {expect} from "chai";
import {ReplayingCluster} from "../../../main/Apha/Replay/ReplayingCluster";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {Event} from "../../../main/Apha/Message/Event";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";

describe("ReplayingCluster", () => {
    let cluster;

    let delegateClusterMock;
    let eventStoreMock;

    beforeEach(() => {
        const delegate = new SimpleCluster("foo");
        const eventStore = new EventStore(
            new SimpleEventBus(),
            new MemoryEventStorage(),
            new JsonSerializer(),
            new EventClassMap([])
        );

        delegateClusterMock = sinon.mock(delegate);
        eventStoreMock = sinon.mock(eventStore);

        cluster = new ReplayingCluster(delegate, eventStore);
    });

    describe("startReplay", () => {
        it("should fetch aggregates and replay their events", () => {
            const ids = new Set<string>();
            ids.add("some-id");

            const event = new ReplayingClusterSpecEvent();

            eventStoreMock.expects("getAggregateIds")
                .once()
                .returns(ids);

            eventStoreMock.expects("getEventsForAggregate")
                .exactly(ids.size)
                .returns([event]);

            delegateClusterMock.expects("publishAll")
                .exactly(ids.size)
                .withArgs(event);

            cluster.startReplay();

            eventStoreMock.verify();
            delegateClusterMock.verify();
        });
    });

    describe("getName", () => {
        it("should return the name of the delegate cluster", () => {
            expect(cluster.getName()).to.equal("foo");
        });
    });

    describe("getMembers", () => {
        it("should return the members of the delegate cluster", () => {
            delegateClusterMock.expects("getMembers").once();

            cluster.getMembers();

            delegateClusterMock.verify();
        });
    });

    describe("subscribe", () => {
        it("should subscribe an event listener to the delegate cluster", () => {
            delegateClusterMock.expects("subscribe").once();

            cluster.subscribe(new ReplayingClusterSpecEventListener());

            delegateClusterMock.verify();
        });
    });

    describe("unsubscribe", () => {
        it("should unsubscribe an event listener from the delegate cluster", () => {
            delegateClusterMock.expects("unsubscribe").once();

            cluster.unsubscribe(new ReplayingClusterSpecEventListener());

            delegateClusterMock.verify();
        });
    });
});

class ReplayingClusterSpecEvent extends Event {}
class ReplayingClusterSpecEventListener implements EventListener {
    public on(event: Event): void {}
}
