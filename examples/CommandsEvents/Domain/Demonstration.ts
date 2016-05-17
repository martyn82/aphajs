
import {AggregateRoot} from "../../../src/main/Apha/Domain/AggregateRoot";
import {Command} from "../../../src/main/Apha/Message/Command";
import {Event} from "../../../src/main/Apha/Message/Event";

export class Demonstration extends AggregateRoot {
    private id: string;
    private isDemonstrated: boolean = false;

    public getId(): string {
        return this.id;
    }

    public demonstrate(command: Demonstration.Demonstrate): void {
        if (!this.isDemonstrated) {
            this.apply(new Demonstration.Demonstrated(command.id));
        }
    }

    public onDemonstrated(event: Demonstration.Demonstrated): void {
        this.id = event.id;
        this.isDemonstrated = true;
    }
}

export namespace Demonstration {
    export class Demonstrate extends Command {
        constructor(private _id: string) {
            super();
        }

        public get id(): string {
            return this._id;
        }
    }
    export class Demonstrated extends Event {
        constructor(id: string) {
            super();
            this._id = id;
        }
    }
}
