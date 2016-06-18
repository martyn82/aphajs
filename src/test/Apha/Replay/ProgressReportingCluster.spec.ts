
import * as sinon from "sinon";
import {ProgressReportingCluster} from "../../../main/Apha/Replay/ProgressReportingCluster";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {Event} from "../../../main/Apha/Message/Event";

describe("ProgressReportingCluster", () => {
    const totalEventCount = 1;
    const reportStep = 5;

    let cluster;

    let delegateClusterMock;

    beforeEach(() => {
        const delegate = new SimpleCluster("foo");

        delegateClusterMock = sinon.mock(delegate);

        cluster = new ProgressReportingCluster(delegate, totalEventCount, reportStep);
    });

    describe("getMembers", () => {
        it("should return the members of the delegate cluster", () => {
            delegateClusterMock.expects("getMembers").once();

            cluster.getMembers();

            delegateClusterMock.verify();
        });
    });

    describe("getName", () => {
        it("should return the name of the delegate cluster", () => {
            delegateClusterMock.expects("getName").once();

            cluster.getName();

            delegateClusterMock.verify();
        });
    });

    describe("subscribe", () => {
        it("should subscribe an event listener to the delegate cluster", () => {
            delegateClusterMock.expects("subscribe").once();

            cluster.subscribe(new ProgressReportingClusterSpecEventListener());

            delegateClusterMock.verify();
        });
    });

    describe("unsubscribe", () => {
        it("should unsubscribe an event listener from the delegate cluster", () => {
            delegateClusterMock.expects("unsubscribe").once();

            cluster.unsubscribe(new ProgressReportingClusterSpecEventListener());

            delegateClusterMock.verify();
        });
    });

    describe("publishAll", () => {
        it("should publish all events to the delegate cluster", () => {
            const event = new ProgressReportingClusterSpecEvent();

            delegateClusterMock.expects("publishAll")
                .once()
                .withArgs(event);

            cluster.publishAll(event);

            delegateClusterMock.verify();
        });
    });
});

class ProgressReportingClusterSpecEvent extends Event {}
class ProgressReportingClusterSpecEventListener implements EventListener {
    public on(event: Event): void {}
}
