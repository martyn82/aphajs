
import {Cluster} from "../EventHandling/Cluster";
import {EventListener} from "../EventHandling/EventListener";
import {Event} from "../Message/Event";

export class ProgressReportingCluster implements Cluster {
    private eventCount: number = 0;
    private lastReportProgress: number = -1;

    constructor(private delegate: Cluster, private totalEventCount: number, private reportStep: number = 5) {}

    public getMembers(): Set<EventListener> {
        return this.delegate.getMembers();
    }

    public getName(): string {
        return this.delegate.getName();
    }

    public publishAll(...events: Event[]): void {
        this.eventCount += events.length;
        this.delegate.publishAll.apply(this.delegate, events);

        const progress = Math.floor(this.eventCount * 100 / this.totalEventCount);

        if (progress % this.reportStep === 0 && this.lastReportProgress !== progress) {
            console.log(`Replay progress: ${progress}% (${this.eventCount} of ${this.totalEventCount} events)`);
            this.lastReportProgress = progress;
        }
    }

    public subscribe(listener: EventListener): void {
        this.delegate.subscribe(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.delegate.unsubscribe(listener);
    }
}
