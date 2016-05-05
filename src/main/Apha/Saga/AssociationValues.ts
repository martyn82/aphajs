
import {AssociationValue} from "./AssociationValue";

export class AssociationValues implements Iterable<AssociationValue> {
    constructor(private items: AssociationValue[] = []) {}

    public add(item: AssociationValue): void {
        if (this.contains(item)) {
            return;
        }

        this.items.push(item);
    }

    public contains(item: AssociationValue): boolean {
        return this.items.filter((i) => {
                return i === item;
            }).length > 0;
    }

    public size(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items.splice(0, this.items.length);
    }

    public getArrayCopy(): AssociationValue[] {
        return this.items.slice(0, this.items.length);
    }

    public [Symbol.iterator](): Iterator<AssociationValue> {
        let items: AssociationValue[] = this.getArrayCopy();
        let cursor: number = 0;

        return {
            next: (value?: any): IteratorResult<AssociationValue> => {
                return (cursor === items.length) ? {done: true} : {done: false, value: items[cursor++]};
            }
        };
    }
}
