
import {AnnotatedCommandHandler} from "../../../src/main/Apha/CommandHandling/AnnotatedCommandHandler";
import {CommandHandler} from "../../../src/main/Apha/CommandHandling/CommandHandlerDecorator";
import {Demonstration} from "./Demonstration";
import {Repository} from "../../../src/main/Apha/Repository/Repository";

export class DemonstrateHandler extends AnnotatedCommandHandler {
    constructor(private repository: Repository<Demonstration>) {
        super();
    }

    @CommandHandler()
    public handleDemonstrate(command: Demonstration.Demonstrate): void {
        console.log("received command", command.fullyQualifiedName);
        let aggregate;

        try {
            aggregate = this.repository.findById(command.id);
        } catch (e) {
            aggregate = new Demonstration();
        }

        aggregate.handle(command);
        this.repository.store(aggregate, aggregate.version);
    }
}
