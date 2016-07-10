
import {Projection} from "../../src/main/Apha/Projections/Projection";
import {Projections} from "../../src/main/Apha/Projections/Projections";
import {ProjectionStorage} from "../../src/main/Apha/Projections/Storage/ProjectionStorage";
import {AnnotatedEventListener} from "../../src/main/Apha/EventHandling/AnnotatedEventListener";
import {Event, EventType} from "../../src/main/Apha/Message/Event";
import {EventListener} from "../../src/main/Apha/EventHandling/EventListenerDecorator";
import {Mixin} from "../../src/main/MixinDecorator";
import {Account} from "./Account";

namespace ProjectionsType {
    export const Account = "Account";
}

export class AccountProjection extends Projection {
    constructor(
        private _id: string,
        private _emailAddress: string,
        private _password: string,
        private _active: boolean
    ) {
        super();
    }
    public get id(): string {return this._id;}
    public get emailAddress(): string {return this._emailAddress;}
    public get password(): string {return this._password;}
    public get active(): boolean {return this._active;}
}

@Mixin(AnnotatedEventListener)
export class AccountProjections extends Projections<AccountProjection> implements AnnotatedEventListener {
    on: (event: Event) => void;
    getSupportedEvents: () => Set<EventType>;

    constructor(storage: ProjectionStorage<AccountProjection>) {
        super(storage, 1, ProjectionsType.Account);
    }

    @EventListener()
    public onAccountRegistered(event: Account.Registered): void {
        const projection = new AccountProjection(event.id, event.emailAddress, event.password, false);
        this.storage.upsert(event.id, projection);
    }

    @EventListener()
    public onAccountActivated(event: Account.Activated): void {
        this.storage.find(event.id).then(account => {
            this.storage.upsert(event.id, account.copy({_active: true}));
        });
    }

    @EventListener()
    public onAccountDeactivated(event: Account.Deactivated): void {
        this.storage.find(event.id).then(account => {
            this.storage.upsert(event.id, account.copy({_active: false}));
        });
    }

    public async findAll(page: number, pageSize: number): Promise<AccountProjection[]> {
        return this.storage.findAll((page - 1) * pageSize, pageSize);
    }

    public async findAllActive(): Promise<AccountProjection[]> {
        return this.storage.findBy({_active: true}, 0, 100000);
    }
}
