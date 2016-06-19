
import {EventClassMap} from "./EventClassMap";
import {DomainEventsReceiver} from "./DomainEventDecorator";

export class AnnotatedEventClassMap extends EventClassMap {
    constructor() {
        super();
        this.init();
    }

    @DomainEventsReceiver()
    public init(): void {}
}
