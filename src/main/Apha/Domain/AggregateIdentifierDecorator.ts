
import "reflect-metadata";
import {MetadataKeys} from "../Decorators/MetadataKeys";
import {DecoratorException} from "../Decorators/DecoratorException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {AnyType} from "../../Inflect";

export type AnnotatedAggregateIdentifier = {
    name: string,
    type: AnyType
};

export namespace AggregateIdentifierDecorator {
    export const AGGREGATE_IDENTIFIER = "annotations:identifier";
}

export function AggregateIdentifier(): Function {
    return (target: Object, name: string): void => {
        let identifier: AnnotatedAggregateIdentifier =
            Reflect.getMetadata(AggregateIdentifierDecorator.AGGREGATE_IDENTIFIER, target);

        if (identifier) {
            throw new DecoratorException(ClassNameInflector.classOf(target), name, "AggregateIdentifier");
        }

        const identifierType: AnyType = Reflect.getOwnMetadata(MetadataKeys.PROPERTY_TYPE, target, name);
        identifier = {
            name: name,
            type: identifierType
        };

        Reflect.defineMetadata(AggregateIdentifierDecorator.AGGREGATE_IDENTIFIER, identifier, target);
    };
}
