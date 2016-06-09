
import {expect} from "chai";
import {Exception} from "../main/Exception";

describe("Exception", () => {
    it("should be filled with sense-making values", () => {
        const e = new SomeDerivedException("my message");

        expect(e).to.be.an.instanceOf(SomeDerivedException);
        expect(e).to.be.an.instanceOf(Exception);

        expect(e.name).to.equal("SomeDerivedException");
        expect(e.message).to.equal("my message");
    });
});

class SomeDerivedException extends Exception {
}
