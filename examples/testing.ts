
import {Scenario} from "../src/main/Apha/Testing/Scenario";
import {AssertEvents} from "../src/main/Apha/Testing/Assert";
import {GenericAggregateFactory} from "../src/main/Apha/Domain/GenericAggregateFactory";
import {TraceableEventStore} from "../src/main/Apha/Testing/TraceableEventStore";
import {SimpleCommandBus} from "../src/main/Apha/CommandHandling/SimpleCommandBus";
import {SimpleEventBus} from "../src/main/Apha/EventHandling/SimpleEventBus";
import {MemoryEventStorage} from "../src/main/Apha/EventStore/Storage/MemoryEventStorage";
import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
import {EventSourcingRepository} from "../src/main/Apha/Repository/EventSourcingRepository";
import {Account} from "./Account/Account";
import {Fixtures} from "./Account/Fixtures";
import {AccountCommandHandler} from "./Account/AccountCommandHandler";
import {AnnotatedEventClassMap} from "../src/main/Apha/EventStore/AnnotatedEventClassMap";

const factory = new GenericAggregateFactory<Account>(Account);
const eventStore = new TraceableEventStore(
    new SimpleEventBus(),
    new MemoryEventStorage(),
    new JsonSerializer(),
    new AnnotatedEventClassMap()
);
const handler = new AccountCommandHandler(new EventSourcingRepository<Account>(factory, eventStore), factory);
const commandBus = new SimpleCommandBus();

commandBus.registerHandler(Account.Register, handler);
commandBus.registerHandler(Account.Activate, handler);
commandBus.registerHandler(Account.Deactivate, handler);

async function main() {
    const scenario = new Scenario(factory, eventStore, commandBus, AssertEvents);

    try {
        console.log(
            "When I register an Account\n" +
            "Then the Account is registered\n"
        );
        await scenario
            .given()
            .when(Fixtures.RegisterAccount)
            .then(Fixtures.AccountRegistered);
    } catch (e) {
        console.error(e);
    }

    try {
        console.log(
            "Given a registered Account\n" +
            "When I activate the Account\n" +
            "Then the Account is activated\n"
        );
        await scenario
            .given(Fixtures.AccountRegistered)
            .when(Fixtures.ActivateAccount)
            .then(Fixtures.AccountActivated);
    } catch (e) {
        console.error(e);
    }

    try {
        console.log(
            "Given an activated Account\n" +
            "When I deactivate the Account\n" +
            "Then the Account is deactivated\n"
        );
        await scenario
            .given(Fixtures.AccountRegistered, Fixtures.AccountActivated)
            .when(Fixtures.DeactivateAccount)
            .then(Fixtures.AccountDeactivated);
    } catch (e) {
        console.error(e);
    }

    try {
        console.log(
            "Given an activated Account\n" +
            "When I activate the Account\n" +
            "Then nothing happened\n"
        );
        await scenario
            .given(Fixtures.AccountRegistered, Fixtures.AccountActivated)
            .when(Fixtures.ActivateAccount)
            .then();
    } catch (e) {
        console.error(e);
    }
}

main();
