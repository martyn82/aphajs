/// <reference path="./../typings/index.d.ts" />

import * as winston from "winston";
import {ProjectionsRebuilder} from "../src/main/Apha/Projections/ProjectionsRebuilder";
import {MemoryVersionStorage} from "../src/main/Apha/Projections/Storage/MemoryVersionStorage";
import {MemoryProjectionStorage} from "../src/main/Apha/Projections/Storage/MemoryProjectionStorage";
import {VersionRepository} from "../src/main/Apha/Projections/VersionRepository";
import {Cluster} from "../src/main/Apha/EventHandling/Cluster";
import {EventStore} from "../src/main/Apha/EventStore/EventStore";
import {SimpleCluster} from "../src/main/Apha/EventHandling/SimpleCluster";
import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
import {MemoryEventStorage} from "../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {EventDescriptor} from "../src/main/Apha/EventStore/EventDescriptor";
import {Account} from "./Account/Account";
import {IdentityProvider} from "../src/main/Apha/Domain/IdentityProvider";
import {ClassNameInflector} from "../src/main/Apha/Inflection/ClassNameInflector";
import {AccountProjections, AccountProjection} from "./Account/AccountProjections";
import {WinstonLogger} from "../src/main/Apha/Logging/WinstonLogger";
import {AnnotatedEventClassMap} from "../src/main/Apha/EventStore/AnnotatedEventClassMap";

class CoreProjectionsRebuilder extends ProjectionsRebuilder {
    constructor(
        versionRepository: VersionRepository,
        cluster: Cluster,
        eventStore: EventStore,
        accountProjections: AccountProjections
    ) {
        super(versionRepository, accountProjections.type, cluster, eventStore);
        cluster.subscribe(accountProjections);
    }
}

// Initialize system ~~~~~~~~~~~~~~~~~~~~~

const logger = new WinstonLogger(new winston.Logger(
    {
        transports: [new winston.transports.Console()],
        level: 'info'
    }
));
const versionRepository = new VersionRepository(new MemoryVersionStorage());
const accountProjections = new AccountProjections(new MemoryProjectionStorage<AccountProjection>());

const serializer = new JsonSerializer();
const eventStorage = new MemoryEventStorage();

const cluster = new SimpleCluster("default");
const eventStore = new EventStore(cluster, eventStorage, serializer, new AnnotatedEventClassMap());

const rebuilder = new CoreProjectionsRebuilder(versionRepository, cluster, eventStore, accountProjections);
rebuilder.logger = logger;

// Seed some events ~~~~~~~~~~~~~~~~~~~~~~
logger.info("*** Creating some data to rebuild...");

const aggregatesToCreate = 1000000;

logger.info(`*** Creating ${aggregatesToCreate} aggregates...`);

let numberOfActive = 0;
let numberOfEvents = 0;
let numberOfAggregates = 0;
let latestProgressReported = -1;

for (let i = 0; i < aggregatesToCreate; i++) {
    let accountId = IdentityProvider.generateNew();
    numberOfAggregates++;

    let event1 = new Account.Registered(accountId, "foo@bar.com", "passwd");
    eventStorage.append(
        new EventDescriptor(
            accountId,
            ClassNameInflector.className(Account),
            ClassNameInflector.classOf(event1),
            serializer.serialize(event1),
            Date.now().toString(),
            0
        )
    );
    numberOfEvents++;

    if (i % 3 === 0) {
        let event2 = new Account.Activated(accountId);
        eventStorage.append(
            new EventDescriptor(
                accountId,
                ClassNameInflector.className(Account),
                ClassNameInflector.classOf(event2),
                serializer.serialize(event2),
                Date.now().toString(),
                1
            )
        );
        numberOfEvents++;

        if (i % 2 === 0) {
            let event3 = new Account.Deactivated(accountId);
            eventStorage.append(
                new EventDescriptor(
                    accountId,
                    ClassNameInflector.className(Account),
                    ClassNameInflector.classOf(event3),
                    serializer.serialize(event3),
                    Date.now().toString(),
                    1
                )
            );
            numberOfEvents++;
        } else {
            numberOfActive++;
        }
    }

    let progress = Math.floor(numberOfAggregates * 100 / aggregatesToCreate);
    if (progress % 5 === 0 && latestProgressReported !== progress) {
        logger.info(
            `*** Creation progress: ${progress}% (${numberOfAggregates} / ${aggregatesToCreate} aggregates created)`
        );
        latestProgressReported = progress;
    }
}

logger.info("*** Creation done.");
logger.info("~~~~~~~~~");

// Start the rebuild ~~~~~~~~~~~~~~~~~~~~~~~

rebuilder.rebuildIfNecessary();

const activeAccounts = accountProjections.findAllActive();

if (activeAccounts.length !== numberOfActive) {
    throw new Error(
        `The number of active accounts (${activeAccounts.length}) did not match the expectation (${numberOfActive}).`
    );
}

logger.info(
    `Rebuilt ${numberOfEvents} events, for ${numberOfAggregates} accounts (of which ${numberOfActive} activated)`
);
logger.info("~~~~~~~~~");

rebuilder.rebuildIfNecessary();
