
import * as sinon from "sinon";
import * as winston from "winston";
import {WinstonLogger} from "../../../main/Apha/Logging/WinstonLogger";

describe("WinstonLogger", () => {
    let logger;

    let innerLoggerMock;

    beforeEach(() => {
        const innerLogger = new winston.Logger({
            transports: [
                new winston.transports.Console()
            ]
        });

        innerLoggerMock = sinon.mock(innerLogger);

        logger = new WinstonLogger(innerLogger);
    });

    describe("log", () => {
        it("should delegate logging to inner logger", () => {
            innerLoggerMock.expects("log").once();

            logger.log("some message");

            innerLoggerMock.verify();
        });
    });
});
