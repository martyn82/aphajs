
import * as sinon from "sinon";
import {ProjectionsRebuilder} from "../../../main/Apha/Projections/ProjectionsRebuilder";
import {VersionRepository, VersionInfo} from "../../../main/Apha/Projections/VersionRepository";
import {MemoryVersionStorage} from "../../../main/Apha/Projections/Storage/MemoryVersionStorage";
import {ProjectionsType} from "../../../main/Apha/Projections/Projections";
import {SimpleCluster} from "../../../main/Apha/EventHandling/SimpleCluster";
import {EventStore} from "../../../main/Apha/EventStore/EventStore";
import {SimpleEventBus} from "../../../main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../../../main/Apha/EventStore/Storage/MemoryEventStorage";
import {JsonSerializer} from "../../../main/Apha/Serialization/JsonSerializer";
import {EventClassMap} from "../../../main/Apha/EventStore/EventClassMap";
import {NullLogger} from "../../../main/Apha/Logging/NullLogger";
import {Event} from "../../../main/Apha/Message/Event";

describe("ProjectionsRebuilder", () => {
    let rebuilder;

    let versionRepositoryMock;
    let eventStoreMock;

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

        versionRepositoryMock = sinon.mock(versionRepository);
        eventStoreMock = sinon.mock(eventStore);

        rebuilder = new ProjectionsRebuilderSpecRebuilder(versionRepository, projectionsType, cluster, eventStore);
        rebuilder.logger = new NullLogger();
    });

    describe("rebuildIfNecessary", () => {
        it("should start rebuild if projections version is bumped", () => {
            const event = new ProjectionsRebuilderSpecEvent();

            eventStoreMock.expects("getAggregateIds")
                .twice()
                .returns(["some-id"]);

            eventStoreMock.expects("getEventsForAggregate")
                .twice()
                .withArgs("some-id")
                .returns([event]);

            rebuilder.rebuildIfNecessary();

            eventStoreMock.verify();
        });

        it("should not rebuild if projections version is unchanged", () => {
            versionRepositoryMock.expects("findByName")
                .once()
                .withArgs("foo")
                .returns(new VersionInfo("foo", 1));

            eventStoreMock.expects("getAggregateIds").never();

            rebuilder.rebuildIfNecessary();

            versionRepositoryMock.verify();
            eventStoreMock.verify();
        });
    });
});

class ProjectionsRebuilderSpecEvent extends Event {}
class ProjectionsRebuilderSpecRebuilder extends ProjectionsRebuilder {}
