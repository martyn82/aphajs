
import * as sinon from "sinon";
import {ProgressReportingCluster} from "../../../main/Apha/Replay/ProgressReportingCluster";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {Event} from "../../../main/Apha/Message/Event";
import {NullLogger} from "../../../main/Apha/Logging/NullLogger";

describe("ProgressReportingCluster", () => {
    const totalEventCount = 1;
    const reportStep = 5;

    let cluster;

    let delegateClusterMock;
    let loggerMock;

    beforeEach(() => {
        const delegate = new SimpleCluster("foo");
        const logger = new NullLogger();

        delegateClusterMock = sinon.mock(delegate);
        loggerMock = sinon.mock(logger);

        cluster = new ProgressReportingCluster(delegate, totalEventCount, logger, reportStep);
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

        it("should report progress to the logger", () => {
            const event = new ProgressReportingClusterSpecEvent();

            loggerMock.expects("log").once();

            cluster.publishAll(event);

            loggerMock.verify();
        });
    });
});

class ProgressReportingClusterSpecEvent extends Event {}
class ProgressReportingClusterSpecEventListener implements EventListener {
    public on(event: Event): void {}
}
