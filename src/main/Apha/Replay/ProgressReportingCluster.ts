
import {Cluster} from "../EventHandling/Cluster";
import {EventListener} from "../EventHandling/EventListener";
import {Event} from "../Message/Event";

export class ProgressReportingCluster implements Cluster {
    private eventCount: number = 0;
    private lastReportProgress: number = -1;

    constructor(private cluster: Cluster, private totalEventCount: number, private reportStep: number) {}

    public getMembers(): Set<EventListener> {
        return this.cluster.getMembers();
    }

    public getName(): string {
        return this.cluster.getName();
    }

    public publishAll(...events: Event[]): void {
        this.eventCount += events.length;
        this.cluster.publishAll.apply(this.cluster, events);

        const progress = Math.floor(this.eventCount * 100 / this.totalEventCount);

        if (progress % this.reportStep === 0 && this.lastReportProgress !== progress) {
            console.log(`Replay progress: ${progress}% (${this.eventCount} of ${this.totalEventCount} events)`);
            this.lastReportProgress = progress;
        }
    }

    public subscribe(listener: EventListener): void {
        this.cluster.subscribe(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.cluster.unsubscribe(listener);
    }
}
