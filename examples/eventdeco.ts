
import {Event} from "../src/main/Apha/Message/Event";
import {AnnotatedEventClassMap} from "../src/main/Apha/EventStore/AnnotatedEventClassMap";
import {DomainEvent} from "../src/main/Apha/EventStore/DomainEventDecorator";

@DomainEvent()
class SomeEvent extends Event {}

const classMap = new AnnotatedEventClassMap();
console.log(classMap);
