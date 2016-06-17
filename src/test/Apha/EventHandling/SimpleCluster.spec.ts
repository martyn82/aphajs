
import * as sinon from "sinon";
import {expect} from "chai";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventListener} from "../../../main/Apha/EventHandling/EventListener";
import {Event} from "../../../main/Apha/Message/Event";

describe("SimpleCluster", () => {
    let cluster;

    beforeEach(() => {
        cluster = new SimpleCluster("name");
    });

    describe("getName", () => {
        it("should return the name of the cluster", () => {
            const cluster = new SimpleCluster("name");
            expect(cluster.getName()).to.equal("name");
        });
    });

    describe("getMembers", () => {
        it("should return the subscribed event listeners", () => {
            const listener = new SimpleClusterSpecEventListener();
            cluster.subscribe(listener);

            expect(cluster.getMembers()).to.eql((new Set<EventListener>()).add(listener));
        });
    });

    describe("subscribe", () => {
        it("should subscribe an event listener", () => {
            const listener = new SimpleClusterSpecEventListener();
            cluster.subscribe(listener);

            expect(cluster.getMembers()).to.eql((new Set<EventListener>()).add(listener));
        });
    });

    describe("unsubscribe", () => {
        it("should unsubscribe an event listener", () => {
            const listener = new SimpleClusterSpecEventListener();
            cluster.subscribe(listener);
            cluster.unsubscribe(listener);

            expect(cluster.getMembers()).to.eql(new Set<EventListener>());
        });
    });

    describe("publish", () => {
        it("should publish an event by notifying all members", () => {
            const event = new SimpleClusterSpecEvent();
            const listener = new SimpleClusterSpecEventListener();
            cluster.subscribe(listener);

            const listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            cluster.publish(event);

            listenerMock.verify();
        });
    });

    describe("publishAll", () => {
        it("should publish all events by notifying all members", () => {
            const event = new SimpleClusterSpecEvent();
            const listener = new SimpleClusterSpecEventListener();
            cluster.subscribe(listener);

            const listenerMock = sinon.mock(listener);
            listenerMock.expects("on").once().withArgs(event);

            cluster.publishAll(event);

            listenerMock.verify();
        });
    });
});

class SimpleClusterSpecEventListener implements EventListener {
    public on(event: Event): void {}
}

class SimpleClusterSpecEvent extends Event {}
