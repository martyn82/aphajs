
import "reflect-metadata";
import {AggregateIdentifierDecorator, AnnotatedAggregateIdentifier} from "./../../Domain/AggregateIdentifierDecorator";
import {AssociationValueResolver} from "./AssociationValueResolver";
import {Event} from "../../Message/Event";
import {AssociationValues} from "../AssociationValues";
import {AssociationValue} from "../AssociationValue";

export class SimpleAssociationValueResolver implements AssociationValueResolver {
    public extractAssociationValues(event: Event): AssociationValues {
        let identifier: AnnotatedAggregateIdentifier =
            Reflect.getMetadata(AggregateIdentifierDecorator.AGGREGATE_IDENTIFIER, event);

        return new AssociationValues([
            new AssociationValue(identifier.name, event[identifier.name])
        ]);
    }
}
