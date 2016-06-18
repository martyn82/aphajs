
import {expect} from "chai";
import {Projection} from "../../../main/Apha/Projections/Projection";

describe("Projection", () => {
    describe("copy", () => {
        it("should copy the projection", () => {
            const original = new ProjectionSpecProjection("foo", 12, true, new Date());
            const copy = original.copy();
            expect(copy).to.eql(original);
        });

        it("should be able to override properties", () => {
            const original = new ProjectionSpecProjection("foo", 12, true, new Date());
            const copy = original.copy({_foo: "bar", _baz: Date.parse("2012-12-12 00:00:00")});

            expect(copy.foo).to.equal("bar");
            expect(copy.bar).to.equal(12);
            expect(copy.boo).to.equal(true);
            expect(copy.baz).to.equal(Date.parse("2012-12-12 00:00:00"));
        });
    });
});

class ProjectionSpecProjection extends Projection {
    constructor(private _foo: string, private _bar: number, private _boo: boolean, private _baz: Date) {
        super();
    }

    public get foo(): string {
        return this._foo;
    }

    public get bar(): number {
        return this._bar;
    }

    public get boo(): boolean {
        return this._boo;
    }

    public get baz(): Date {
        return this._baz;
    }
}
