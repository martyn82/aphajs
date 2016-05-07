
import {AssociationValueResolver} from "./AssociationValueResolver";
import {Event} from "../Message/Event";
import {AssociationValues} from "./AssociationValues";
import {AssociationValue} from "./AssociationValue";

export class SimpleAssociationValueResolver implements AssociationValueResolver {
    public extractAssociationValues(event: Event): AssociationValues {
        let associationValues = new AssociationValues();

        for (let property in event) {
            associationValues.add(new AssociationValue(property, event[property]));
        }

        return associationValues;
    }
}
