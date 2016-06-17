
import {expect} from "chai";
import {Projections} from "../../../main/Apha/Projections/Projections";
import {Projection} from "../../../main/Apha/Projections/Projection";
import {MemoryProjectionStorage} from "../../../main/Apha/Projections/Storage/MemoryProjectionStorage";

describe("Projections", () => {
    let projections;

    beforeEach(() => {
        projections = new ProjectionsSpecProjections(new MemoryProjectionStorage(), 1, "Name");
    });

    describe("type", () => {
        it("should return the type of projection", () => {
            expect(projections.type.name).to.equal("Name");
            expect(projections.type.version).to.equal(1);
        });
    });
});

class ProjectionsSpecProjection extends Projection {}
class ProjectionsSpecProjections extends Projections<ProjectionsSpecProjection> {}
