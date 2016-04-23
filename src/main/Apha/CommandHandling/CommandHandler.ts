
import {Command} from "../Message/Command";

export interface CommandHandler {
    handle(command: Command): void;
}
