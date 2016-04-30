
import {Event} from "../Message/Event";
import {AssociationValues} from "./AssociationValues";

export interface AssociationValueResolver {
    extractAssociationValues(event: Event): AssociationValues;
}
