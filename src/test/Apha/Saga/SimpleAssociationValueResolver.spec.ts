
import {expect} from "chai";
import {Event} from "../../../main/Apha/Message/Event";
import {SimpleAssociationValueResolver} from "../../../main/Apha/Saga/SimpleAssociationValueResolver";
import {AssociationValue} from "../../../main/Apha/Saga/AssociationValue";

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

            expect(associationValueArray).to.have.lengthOf(4);
            expect(associationValueArray[0]).to.eql(new AssociationValue("version", 0));
            expect(associationValueArray[1]).to.eql(new AssociationValue("id", "idValue"));
            expect(associationValueArray[2]).to.eql(new AssociationValue("isSomething", false));
            expect(associationValueArray[3]).to.eql(new AssociationValue("aNumber", 432));
        });
    });
});

class SimpleAssociationValueResolverSpecEvent extends Event {
    constructor(public id: string, public isSomething: boolean, public aNumber: number) {
        super();
    }
}
