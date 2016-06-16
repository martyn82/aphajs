
import {AnnotatedAggregateRoot} from "../../src/main/Apha/Domain/AnnotatedAggregateRoot";
import {CommandHandler} from "../../src/main/Apha/CommandHandling/CommandHandlerDecorator";
import {EventListener} from "../../src/main/Apha/EventHandling/EventListenerDecorator";
import {Command} from "../../src/main/Apha/Message/Command";
import {Event} from "../../src/main/Apha/Message/Event";

export class Account extends AnnotatedAggregateRoot {
    private _id: string;
    private _registered: boolean = false;
    private _active: boolean = false;

    public getId(): string {
        return this._id;
    }

    @CommandHandler({type: Account, commandName: "Register"})
    public register(command: Account.Register) {
        if (!this._registered) {
            this.apply(new Account.Registered(command.id, command.emailAddress, command.password));
        }
    }

    @EventListener({type: Account, eventName: "Registered"})
    public onRegistered(event: Account.Registered) {
        this._id = event.id;
        this._registered = true;
    }

    @CommandHandler({type: Account, commandName: "Activate"})
    public activate(command: Account.Activate) {
        if (!this._active) {
            this.apply(new Account.Activated(command.id));
        }
    }

    @EventListener({type: Account, eventName: "Activated"})
    public onActivated(event: Account.Activated) {
        this._active = true;
    }

    @CommandHandler({type: Account, commandName: "Deactivate"})
    public deactivate(command: Account.Deactivate) {
        if (this._active) {
            this.apply(new Account.Deactivated(command.id));
        }
    }

    @EventListener({type: Account, eventName: "Deactivated"})
    public onDeactivated(event: Account.Deactivated) {
        this._active = false;
    }
}

export namespace Account {
    export class Register extends Command {
        constructor(protected _id: string, private _emailAddress: string, private _password: string) {super();}
        public get emailAddress(): string {return this._emailAddress;}
        public get password(): string {return this._password;}
    }
    export class Registered extends Event {
        constructor(protected _id: string, private _emailAddress: string, private _password: string) {super();}
        public get emailAddress(): string {return this._emailAddress;}
        public get password(): string {return this._password;}
    }

    export class Activate extends Command {
        constructor(protected _id: string) {super();}
    }
    export class Activated extends Event {
        constructor(protected _id: string) {super();}
    }

    export class Deactivate extends Command {
        constructor(protected _id: string) {super();}
    }
    export class Deactivated extends Event {
        constructor(protected _id: string) {super();}
    }
}
