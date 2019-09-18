export = SortedArraySet;
export as namespace SortedArraySet;

declare namespace SortedArraySet { }

declare class SortedArraySet<V> {

    constructor(values?: V[]);

    length: number;

    has(value: V): boolean;

    push(...values: V[]): void;

    delete(value: V): boolean;

    forEach(callback: (value: V) => void): void;

    sorted(compareFn?: (a: V, b: V) => number): V[];

    some(callback: (value: V) => boolean): boolean;

    clear(): void;

    toArray(): V[];

    hiveAdd(value: V): boolean;

    hiveAddEach(values: V[]): SortedArraySet<V>;
}
