
import {Message} from "../../Message/Message";

export interface ParameterResolver {
    resolveParameterValue(message: Message, propertyName: string): any;
}
