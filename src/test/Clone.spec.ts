
import {expect} from "chai";
import {clone} from "../main/Clone";

describe("Clone", () => {
    it("should clone objects", () => {
        const original = {
            foo: "foo",
            bar: 12,
            baz: true,
            boo: [],
            fizz: [
                {},
                false,
                24
            ],
            buzz: new Date()
        };

        const copy = clone(original);
        expect(copy).to.eql(original);
    });

    it("should clone arrays", () => {
        const original = [
            {
                foo: "foo"
            },
            54,
            true,
            new Date()
        ];

        const copy = clone(original);
        expect(copy).to.eql(original);
    });

    it("should clone dates", () => {
        const original = new Date();
        const copy = clone(original);
        expect(copy).to.eql(original);
    });

    it("should clone null", () => {
        const original = null;
        const copy = clone(original);
        expect(copy).to.be.null;
    });

    it("should clone undefined", () => {
        const original = undefined;
        const copy = clone(original);
        expect(copy).to.be.undefined;
    });

    it("should clone objects into target", () => {
        const original = {
            _foo: "foo",
            _bar: 12,
            _baz: true,
            _boo: [],
            _fizz: [
                {},
                false,
                24
            ],
            _buzz: new Date()
        };

        const target = new CloneSpecType();
        const copy = clone(original, target);

        expect(copy).to.eql(original);
    });
});

class CloneSpecType {
    private _foo: string;
    private _bar: number;
    private _baz: boolean;
    private _boo: any[];
    private _fizz: any[];
    private _buzz: Date;

    public get foo(): string {
        return this._foo;
    }
    public get bar(): number {
        return this._bar;
    }
    public get baz(): boolean {
        return this._baz;
    }
    public get boo(): any[] {
        return this._boo;
    }
    public get fizz(): any[] {
        return this._fizz;
    }
    public get buzz(): Date {
        return this._buzz;
    }
}
