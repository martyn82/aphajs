
import {expect} from "chai";
import {ClassNameInflector} from "../../../main/Apha/Inflection/ClassNameInflector";
import {InflectionException} from "../../../main/Apha/Inflection/InflectionException";
import ClassNameInflectorSpecNamespacedClass = ClassNameInflectorSpecNamespace.ClassNameInflectorSpecNamespacedClass;

describe("ClassNameInflector", () => {
    describe("classOf", () => {
        it("should inflect class name from object", () => {
            const object = new ClassNameInflectorSpecClass();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecClass");
        });

        it("should inflect class name from inherited object", () => {
            const object = new ClassNameInflectorSpecChild();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecChild");
        });

        it("should inflect class name from namespaced class", () => {
            const object = new ClassNameInflectorSpecNamespace.ClassNameInflectorSpecNamespacedClass();
            expect(ClassNameInflector.classOf(object)).to.equal("ClassNameInflectorSpecNamespacedClass");
        });

        it("should inflect class name with context", () => {
            const object = new ClassNameInflectorSpecClass2.ClassNameInflectorSpecNamespacedClass2();
            expect(ClassNameInflector.classOf(object, ClassNameInflectorSpecClass2)).to.equal(
                "ClassNameInflectorSpecClass2$ClassNameInflectorSpecNamespacedClass2"
            );
        });

        it("should throw exception if no name can be inflected", () => {
            expect(() => {
                ClassNameInflector.classOf("");
            }).to.throw(InflectionException);
        });
    });

    describe("className", () => {
        it("should inflect class name from type", () => {
            expect(ClassNameInflector.className(ClassNameInflectorSpecClass)).to.equal("ClassNameInflectorSpecClass");
        });

        it("should inflect class name from inherited type", () => {
            expect(ClassNameInflector.className(ClassNameInflectorSpecChild)).to.equal("ClassNameInflectorSpecChild");
        });

        it("should inflect class name from namespaced type", () => {
            expect(
                ClassNameInflector.className(ClassNameInflectorSpecNamespace.ClassNameInflectorSpecNamespacedClass)
            ).to.equal("ClassNameInflectorSpecNamespacedClass");
        });

        it("should inflect class name with context", () => {
            expect(
                ClassNameInflector.className(
                    ClassNameInflectorSpecClass2.ClassNameInflectorSpecNamespacedClass2,
                    ClassNameInflectorSpecClass2
                )
            ).to.equal("ClassNameInflectorSpecClass2$ClassNameInflectorSpecNamespacedClass2");
        });
    });
});

class ClassNameInflectorSpecClass {}
class ClassNameInflectorSpecChild extends ClassNameInflectorSpecClass {}

namespace ClassNameInflectorSpecNamespace {
    export class ClassNameInflectorSpecNamespacedClass {}
}

class ClassNameInflectorSpecClass2 {}
namespace ClassNameInflectorSpecClass2 {
    export class ClassNameInflectorSpecNamespacedClass2 {}
}
