
import {Command} from "../../../src/main/Apha/Message/Command";
import {Event} from "../../../src/main/Apha/Message/Event";
import {AnnotatedAggregateRoot} from "../../../src/main/Apha/Domain/AnnotatedAggregateRoot";
import {CommandHandler} from "../../../src/main/Apha/CommandHandling/CommandHandlerDecorator";
import {EventListener} from "../../../src/main/Apha/EventHandling/EventListenerDecorator";

export class Demonstration extends AnnotatedAggregateRoot {
    private id: string;
    private isDemonstrated: boolean = false;

    public getId(): string {
        return this.id;
    }

    @CommandHandler({type: Demonstration, commandName: "Demonstrate"})
    public demonstrate(command: Demonstration.Demonstrate): void {
        if (!this.isDemonstrated) {
            this.apply(new Demonstration.Demonstrated(command.id));
        }
    }

    @EventListener({type: Demonstration, eventName: "Demonstrated"})
    public onDemonstrated(event: Demonstration.Demonstrated): void {
        this.id = event.id;
        this.isDemonstrated = true;
    }
}

export namespace Demonstration {
    export class Demonstrate extends Command {
        constructor(protected _id: string) {super();}
    }
    export class Demonstrated extends Event {
        constructor(protected _id: string) {super();}
    }
}
