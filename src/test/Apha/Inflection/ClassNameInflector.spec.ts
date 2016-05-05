
import {expect} from "chai";
import {ClassNameInflector} from "../../../main/Apha/Inflection/ClassNameInflector";
import {InflectionException} from "../../../main/Apha/Inflection/InflectionException";

describe("ClassNameInflector", () => {
    describe("classOf", () => {
        it("inflects class name from object", () => {
            let object = new ClassNameInflectorSpecClass();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecClass");
        });

        it("inflects class name from inherited object", () => {
            let object = new ClassNameInflectorSpecChild();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecChild");
        });

        it("inflects class name from namspaced class", () => {
            let object = new ClassNameInflectorSpecNamespace.ClassNameInflectorSpecNamespacedClass();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecNamespacedClass");
        });

        it("throws exception if no name can be inflected", () => {
            expect(() => {
                ClassNameInflector.classOf("");
            }).to.throw(InflectionException);
        });
    });

    describe("className", () => {
        it("inflects class name from type", () => {
            expect(ClassNameInflector.className(ClassNameInflectorSpecClass)).to.equal("ClassNameInflectorSpecClass");
        });

        it("inflects class name from inherited type", () => {
            expect(ClassNameInflector.className(ClassNameInflectorSpecChild)).to.equal("ClassNameInflectorSpecChild");
        });

        it("inflects class name from namespaced type", () => {
            expect(
                ClassNameInflector.className(ClassNameInflectorSpecNamespace.ClassNameInflectorSpecNamespacedClass)
            ).to.equal("ClassNameInflectorSpecNamespacedClass");
        });
    });
});

class ClassNameInflectorSpecClass {}
class ClassNameInflectorSpecChild extends ClassNameInflectorSpecClass {}

namespace ClassNameInflectorSpecNamespace {
    export class ClassNameInflectorSpecNamespacedClass {}
}
