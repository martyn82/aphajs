
import {Message} from "./Message";

export type CommandType = {new(...args: any[]): Command};

export abstract class Command extends Message {
}
