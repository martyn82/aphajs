
import {AssociationValueResolver} from "./AssociationValueResolver";
import {Event} from "../../Message/Event";
import {AssociationValues} from "../AssociationValues";
import {AssociationValue} from "../AssociationValue";

export class SimpleAssociationValueResolver implements AssociationValueResolver {
    public extractAssociationValues(event: Event): AssociationValues {
        return new AssociationValues([
            new AssociationValue("id", event.getId())
        ]);
    }
}
