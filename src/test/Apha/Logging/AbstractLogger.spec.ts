
import * as sinon from "sinon";
import {expect} from "chai";
import {Logging} from "../../../main/Apha/Logging/Logger";
import {AbstractLogger} from "../../../main/Apha/Logging/AbstractLogger";

describe("AbstractLogger", () => {
    let logger;

    beforeEach(() => {
        logger = new AbstractLoggerSpecLogger();
        sinon.spy(logger, "log");
    });

    describe("emergency", () => {
        it("should log emergency", () => {
            logger.emergency("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Emergency);
        });
    });

    describe("alert", () => {
        it("should log alert", () => {
            logger.alert("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Alert);
        });
    });

    describe("critical", () => {
        it("should log critical", () => {
            logger.critical("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Critical);
        });
    });

    describe("error", () => {
        it("should log error", () => {
            logger.error("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Error);
        });
    });

    describe("warning", () => {
        it("should log warning", () => {
            logger.warning("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Warning);
        });
    });

    describe("notice", () => {
        it("should log notice", () => {
            logger.notice("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Notice);
        });
    });

    describe("info", () => {
        it("should log info", () => {
            logger.info("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Info);
        });
    });

    describe("debug", () => {
        it("should log debug", () => {
            logger.debug("some message");

            expect(logger.log.calledOnce).to.be.true;
            expect(logger.log.getCall(0).args[0]).to.equal(Logging.Level.Debug);
        });
    });
});

class AbstractLoggerSpecLogger extends AbstractLogger {
    public log(level: Logging.Level, message: string, context?: Object): void {}
}
