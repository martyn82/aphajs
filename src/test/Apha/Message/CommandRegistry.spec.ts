
import {expect} from "chai";
import {CommandRegistry} from "../../../main/Apha/Message/CommandRegistry";
import {Command} from "../../../main/Apha/Message/Command";

describe("CommandRegistry", () => {
    let registry;

    beforeEach(() => {
        registry = new CommandRegistry();
    });

    describe("register", () => {
        it("should register a command", () => {
            registry.register(SomeCommand);
            expect(registry.find("SomeCommand")).to.eql(SomeCommand);
        });
    });

    describe("unregister", () => {
        it("should unregister a command", () => {
            registry.register(SomeCommand);
            registry.unregister(SomeCommand);
            expect(registry.exists(SomeCommand)).to.be.false;
        });
    });

    describe("find", () => {
        it("should find a registered command", () => {
            registry.register(SomeCommand);
            expect(registry.find("SomeCommand")).to.eql(SomeCommand);
        });

        it("should return NULL if command is not registered", () => {
            expect(registry.find("SomeCommand")).to.equal(null);
        });
    });

    describe("entries", () => {
        it("should return all commands in the registry", () => {
            registry.register(SomeCommand);

            const entries = [];
            for (const entry of registry.entries()) {
                entries.push(entry);
            };

            expect(entries).to.eql([SomeCommand]);
        });

        it("should return an empty iterator if registry is empty", () => {
            const entries = [];
            for (const entry of registry.entries()) {
                entries.push(entry);
            }

            expect(entries).to.eql([]);
        });
    });

    describe("exists", () => {
        it("should return true if a command exists in the registry", () => {
            registry.register(SomeCommand);
            expect(registry.exists(SomeCommand)).to.be.true;
        });

        it("should return false if a command does not exist in the registry", () => {
            expect(registry.exists(SomeCommand)).to.be.false;
        });
    });
});

class SomeCommand extends Command {}
