
import {AnnotatedEventListener} from "../../../src/main/Apha/EventHandling/AnnotatedEventListener";
import {EventListener} from "../../../src/main/Apha/EventHandling/EventListenerDecorator";
import {EventStorage} from "../../../src/main/Apha/EventStore/Storage/EventStorage";
import {Demonstration} from "./Demonstration";

export class DemonstratedListener extends AnnotatedEventListener {
    constructor(private storage: EventStorage) {
        super();
    }

    @EventListener()
    public onDemonstrated(event: Demonstration.Demonstrated): void {
        console.log("received event", event.fullyQualifiedName);

        const identities = this.storage.findIdentities();
        console.log("stored aggregates:", identities);

        identities.forEach((identity) => {
            const events = this.storage.find(identity);
            console.log(identity, "events:", events);
        });
    }
}
