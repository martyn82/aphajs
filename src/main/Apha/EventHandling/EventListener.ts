
import {Event} from "../Message/Event";

export interface EventListener {
    on(event: Event): void;
}
