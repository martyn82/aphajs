
import {expect} from "chai";
import {Mixin} from "../main/MixinDecorator";

describe("MixinDecorator", () => {
    it("should apply mixins for annotated class", () => {
        const derived = new MixinDecoratorSpecDerivedClass();

        expect(derived).to.be.an.instanceOf(MixinDecoratorSpecDerivedClass);
        expect(derived).to.be.an.instanceOf(MixinDecoratorSpecBaseClass1);

        // don't expect that it will be instances of these
        expect(derived).not.to.be.an.instanceOf(MixinDecoratorSpecBaseClass2);
        expect(derived).not.to.be.an.instanceOf(MixinDecoratorSpecBaseClass3);

        expect(derived.getFizz()).to.equal("fizz");
        expect(derived.getFoo()).to.equal("foo");
        expect(derived.getBar()).to.equal("bar");
        expect(derived.getBaz()).to.equal("baz");
    });
});

abstract class MixinDecoratorSpecBaseClass1 {
    public getFoo(): string {
        return "foo";
    }
}

class MixinDecoratorSpecBaseClass2 {
    public getBar(): string {
        return "bar";
    }
}

abstract class MixinDecoratorSpecBaseClass3 {
    public getBaz(): string {
        return "baz";
    }
}

@Mixin(MixinDecoratorSpecBaseClass2, MixinDecoratorSpecBaseClass3)
class MixinDecoratorSpecDerivedClass
    extends MixinDecoratorSpecBaseClass1
    implements MixinDecoratorSpecBaseClass2, MixinDecoratorSpecBaseClass3 {

    getBar: () => string;
    getBaz: () => string;

    public getFizz(): string {
        return "fizz";
    }
}
