export = SortedMap;
export as namespace SortedMap;

declare namespace SortedMap { }

declare class SortedMap<K, V> {

    constructor(values?: { [key: string]: V }, equals?: (a: K, b: K) => boolean, compare?: (a: K, b: K) => number, getDefault?: () => V);

    constructor(values?: { [key: number]: V }, equals?: (a: K, b: K) => boolean, compare?: (a: K, b: K) => number, getDefault?: () => V);

    length: number;

    has(key: K): boolean;

    get(key: K): V;

    set(key: K, value: V): void;

    keys(): K[];

    values(): V[];

    entries(): [K, V];

    delete(key: K): boolean;

    forEach(callback: (value: V, key: K) => void): void;

    filter(callback: (value: V, key: K) => boolean): SortedMap<K, V>;

    clear(): void;

    map<U>(callback: (value: V, index: number, array: V[]) => U, thisArg?: any): U[];

    concat(map: SortedMap<K, V>): SortedMap<K, V>;

}
