
import {expect} from "chai";
import {Event} from "../../../../main/Apha/Message/Event";
import {SimpleAssociationValueResolver} from "./../../../../main/Apha/Saga/Annotation/SimpleAssociationValueResolver";
import {AssociationValue} from "../../../../main/Apha/Saga/AssociationValue";

describe("SimpleAssociationValueResolver", () => {
    let resolver;

    beforeEach(() => {
        resolver = new SimpleAssociationValueResolver();
    });

    describe("extractAssociationValues", () => {
        it("extracts all properties of event", () => {
            let event = new SimpleAssociationValueResolverSpecEvent("idValue", false, 432);
            let associationValues = resolver.extractAssociationValues(event);
            let associationValueArray = associationValues.getArrayCopy();

            expect(associationValueArray).to.have.lengthOf(1);
            expect(associationValueArray[0]).to.eql(new AssociationValue("id", "idValue"));
        });
    });
});

class SimpleAssociationValueResolverSpecEvent extends Event {
    constructor(public id: string, public isSomething: boolean, public aNumber: number) {
        super();
        this.setId(id);
    }
}
