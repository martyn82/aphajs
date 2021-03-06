
import * as sinon from "sinon";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {expect} from "chai";
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

chai.use(chaiAsPromised);

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
            new EventClassMap()
        );

        versionRepositoryMock = sinon.mock(versionRepository);
        eventStoreMock = sinon.mock(eventStore);

        rebuilder = new ProjectionsRebuilderSpecRebuilder(versionRepository, projectionsType, cluster, eventStore);
        rebuilder.logger = new NullLogger();
    });

    describe("rebuildIfNecessary", () => {
        it("should start rebuild if projections version is bumped", (done) => {
            const promisedIds = new Promise<Set<string>>(resolve => {
                const ids = new Set<string>();
                ids.add("some-id");
                resolve(ids);
            });

            const event = new ProjectionsRebuilderSpecEvent();
            const promisedEvents = new Promise<Event[]>(resolve => resolve([event]));

            eventStoreMock.expects("getAggregateIds")
                .twice()
                .returns(promisedIds);

            eventStoreMock.expects("getEventsForAggregate")
                .twice()
                .withArgs("some-id")
                .returns(promisedEvents);

            expect(rebuilder.rebuildIfNecessary()).to.eventually.be.fulfilled.and.satisfy(() => {
                eventStoreMock.verify();
                return true;
            }).and.notify(done);
        });

        it("should not rebuild if projections version is unchanged", (done) => {
            versionRepositoryMock.expects("findByName")
                .once()
                .withArgs("foo")
                .returns(new Promise<VersionInfo>(resolve => resolve(new VersionInfo("foo", 1))));

            eventStoreMock.expects("getAggregateIds")
                .never();

            expect(rebuilder.rebuildIfNecessary()).to.eventually.be.fulfilled.and.satisfy(() => {
                versionRepositoryMock.verify();
                eventStoreMock.verify();
                return true;
            }).and.notify(done);
        });
    });
});

class ProjectionsRebuilderSpecEvent extends Event {}
class ProjectionsRebuilderSpecRebuilder extends ProjectionsRebuilder {}
