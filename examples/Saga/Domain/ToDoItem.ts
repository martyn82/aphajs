
import {Command} from "../../../src/main/Apha/Message/Command";
import {Event} from "../../../src/main/Apha/Message/Event";
import {AnnotatedAggregateRoot} from "../../../src/main/Apha/Domain/AnnotatedAggregateRoot";
import {CommandHandler} from "../../../src/main/Apha/CommandHandling/CommandHandlerDecorator";
import {EventListener} from "../../../src/main/Apha/EventHandling/EventListenerDecorator";

export class ToDoItem extends AnnotatedAggregateRoot {
    private id: string;
    private description: string;
    private expireSeconds: number;
    private isDone: boolean;

    public getId(): string {
        return this.id;
    }

    @CommandHandler({type: ToDoItem, commandName: "Create"})
    public create(command: ToDoItem.Create): void {
        this.apply(new ToDoItem.Created(command.id, command.description, command.expireSeconds));
    }

    @EventListener({type: ToDoItem, eventName: "Created"})
    public onCreated(event: ToDoItem.Created): void {
        this.id = event.id;
        this.description = event.description;
        this.expireSeconds = event.expireSeconds;
        this.isDone = false;
    }

    @CommandHandler({type: ToDoItem, commandName: "MarkAsDone"})
    public markAsDone(command: ToDoItem.MarkAsDone): void {
        if (!this.isDone) {
            this.apply(new ToDoItem.MarkedAsDone(command.id));
        }
    }

    @EventListener({type: ToDoItem, eventName: "MarkedAsDone"})
    public onMarkedAsDone(event: ToDoItem.MarkedAsDone): void {
        this.isDone = true;
    }

    @CommandHandler({type: ToDoItem, commandName: "Expire"})
    public expire(command: ToDoItem.Expire): void {
        if (!this.isDone) {
            this.apply(new ToDoItem.Expired(command.id));
        }
    }

    @EventListener({type: ToDoItem, eventName: "Expired"})
    public onExpired(event: ToDoItem.Expired): void {
        this.isDone = true;
    }
}

export namespace ToDoItem {
    export class Create extends Command {
        constructor(private _id: string, private _description: string, private _expireSeconds: number) {
            super();
        }

        public get id(): string {
            return this._id;
        }

        public get description(): string {
            return this._description;
        }

        public get expireSeconds(): number {
            return this._expireSeconds;
        }
    }
    export class Created extends Event {
        constructor(id: string, private _description: string, private _expireSeconds: number) {
            super();
            this._id = id;
        }

        public get description(): string {
            return this._description;
        }

        public get expireSeconds(): number {
            return this._expireSeconds;
        }
    }

    export class MarkAsDone extends Command {
        constructor(private _id: string) {
            super();
        }

        public get id(): string {
            return this._id;
        }
    }
    export class MarkedAsDone extends Event {
        constructor(id: string) {
            super();
            this._id = id;
        }
    }

    export class Expire extends Command {
        constructor(private _id: string) {
            super();
        }

        public get id(): string {
            return this._id;
        }
    }
    export class Expired extends Event {
        constructor(id: string) {
            super();
            this._id = id;
        }
    }
}
