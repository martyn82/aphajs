
import {ParameterResolver} from "./ParameterResolver";
import {Message} from "../Message/Message";

export class DefaultParameterResolver implements ParameterResolver {
    public resolveParameterValue(message: Message, propertyName: string): any {
        return message[propertyName];
    }
}
