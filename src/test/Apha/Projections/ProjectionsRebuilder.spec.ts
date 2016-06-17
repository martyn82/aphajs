
import {ProjectionsRebuilder} from "../../../main/Apha/Projections/ProjectionsRebuilder";
import {VersionRepository} from "../../../main/Apha/Projections/VersionRepository";
import {MemoryVersionStorage} from "../../../main/Apha/Projections/Storage/MemoryVersionStorage";
import {ProjectionsType} from "../../../main/Apha/Projections/Projections";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";

describe("ProjectionsRebuilder", () => {
    let rebuilder;

    beforeEach(() => {
        const versionRepository = new VersionRepository(new MemoryVersionStorage());
        const projectionsType = new ProjectionsType("foo", 1);
        const cluster = new SimpleCluster("default");
        const eventStore = new EventStore(
            new SimpleEventBus(),
            new MemoryEventStorage(),
            new JsonSerializer(),
            new EventClassMap([])
        );

        rebuilder = new ProjectionsRebuilderSpecRebuilder(versionRepository, projectionsType, cluster, eventStore);
    });

    describe("rebuildIfNecessary", () => {
        it("should start rebuild if projections version is bumped", () => {
            rebuilder.rebuildIfNecessary();
        });
    });
});

class ProjectionsRebuilderSpecRebuilder extends ProjectionsRebuilder {}
