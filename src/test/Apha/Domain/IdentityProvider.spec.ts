
import {expect} from "chai";
import {IdentityProvider} from "../../../main/Apha/Domain/IdentityProvider";

describe("IdentityProvider", () => {
    describe("generateNew", () => {
        it("generates a UUID string", () => {
            const value = IdentityProvider.generateNew();
            expect(value).not.to.be.undefined;
        });
    });
});
