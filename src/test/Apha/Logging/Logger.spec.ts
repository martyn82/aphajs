
import {expect} from "chai";
import {Logging} from "../../../main/Apha/Logging/Logger";

describe("Logger", () => {
    describe("Level.nameOf", () => {
        it("should retrieve correct names for log levels", () => {
            expect(Logging.nameOf(Logging.Level.Emergency)).to.equal(Logging.EMERGENCY);
            expect(Logging.nameOf(Logging.Level.Alert)).to.equal(Logging.ALERT);
            expect(Logging.nameOf(Logging.Level.Critical)).to.equal(Logging.CRITICAL);
            expect(Logging.nameOf(Logging.Level.Error)).to.equal(Logging.ERROR);
            expect(Logging.nameOf(Logging.Level.Warning)).to.equal(Logging.WARNING);
            expect(Logging.nameOf(Logging.Level.Notice)).to.equal(Logging.NOTICE);
            expect(Logging.nameOf(Logging.Level.Info)).to.equal(Logging.INFO);
            expect(Logging.nameOf(Logging.Level.Debug)).to.equal(Logging.DEBUG);
        });
    });
});
