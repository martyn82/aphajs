
import {EventSourcingRepository} from "../../src/main/Apha/Repository/EventSourcingRepository";
import {CommandHandler} from "../../src/main/Apha/CommandHandling/CommandHandler";
import {AggregateFactory} from "../../src/main/Apha/Domain/AggregateFactory";
import {Command} from "../../src/main/Apha/Message/Command";
import {Account} from "./Account";

export class AccountCommandHandler implements CommandHandler {
    constructor(private repository: EventSourcingRepository<Account>, private factory: AggregateFactory<Account>) {}

    public handle(command: Command) {
        let aggregate;

        try {
            aggregate = this.repository.findById(command.id);
        } catch (e) {
            aggregate = this.factory.createAggregate([]);
        }

        aggregate.handle(command);
        this.repository.store(aggregate, aggregate.version);
    }
}
