
import {EventSourcingRepository} from "../../src/main/Apha/Repository/EventSourcingRepository";
import {CommandHandler} from "../../src/main/Apha/CommandHandling/CommandHandler";
import {AggregateFactory} from "../../src/main/Apha/Domain/AggregateFactory";
import {Command} from "../../src/main/Apha/Message/Command";
import {Account} from "./Account";

export class AccountCommandHandler implements CommandHandler {
    constructor(private repository: EventSourcingRepository<Account>, private factory: AggregateFactory<Account>) {}

    public async handle(command: Command): Promise<void> {
        let aggregate;

        try {
            aggregate = await this.repository.findById(command.id);
        } catch (e) {
            aggregate = this.factory.createAggregate([]);
        }

        await aggregate.handle(command);
        await this.repository.store(aggregate, aggregate.version);
    }
}
