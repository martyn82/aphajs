
import {Command} from "../../Message/Command";

export interface CommandGateway {
    send(command: Command): Promise<void>;
}
