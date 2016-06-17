
import {VersionRepository} from "./VersionRepository";
import {ProjectionsType} from "./Projections";
import {ReplayingCluster} from "../Replay/ReplayingCluster";
import {EventStore} from "../EventStore/EventStore";
import {Cluster} from "../EventHandling/Cluster";
import {ProgressReportingCluster} from "../Replay/ProgressReportingCluster";

export abstract class ProjectionsRebuilder {
    constructor(
        private versionRepository: VersionRepository,
        private projectionsType: ProjectionsType,
        private cluster: Cluster,
        private eventStore: EventStore
    ) {}

    public rebuildIfNecessary(): void {
        if (this.isRebuildNecessary()) {
            this.rebuild();
        } else {
            console.log(`${this.projectionsType.name}: No rebuild is necessary`);
        }
    }

    private isRebuildNecessary(): boolean {
        const versionInfo = this.versionRepository.findByName(this.projectionsType.name);

        if (versionInfo) {
            return versionInfo.version !== this.projectionsType.version;
        }

        return true;
    }

    protected rebuild(): void {
        console.log(`${this.projectionsType.name} rebuild necessary`);

        const eventCount = this.countEvents();
        const replayingCluster = new ReplayingCluster(
            new ProgressReportingCluster(this.cluster, eventCount, 5),
            this.eventStore
        );

        console.log(`Starting ${this.projectionsType.name} rebuild, ${eventCount} events`);
        const startTime = Date.now();

        try {
            replayingCluster.startReplay();
            this.versionRepository.updateVersion(this.projectionsType.name, this.projectionsType.version);

            console.log(`${this.projectionsType.name} rebuild finished in ${Date.now() - startTime} ms`);
        } catch (e) {
            console.error(`${this.projectionsType.name} rebuild failed after ${Date.now() - startTime} ms`);
            throw e;
        }
    }

    private countEvents(): number {
        let eventCount = 0;

        this.eventStore.getAggregateIds().forEach(aggregateId => {
            eventCount += this.eventStore.getEventsForAggregate(aggregateId).length;
        });

        return eventCount;
    }
}
