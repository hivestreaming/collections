"use strict";

/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

var Function = require("./shim-function");
var GenericCollection = require("./generic-collection");
var GenericOrder = require("./generic-order");
var WeakMap = require("weak-map");

module.exports = Array;

var array_splice = Array.prototype.splice;
var array_slice = Array.prototype.slice;

Array.empty = [];

if (Object.freeze) {
    Object.freeze(Array.empty);
}

Array.from = Array.from || function (values) {
    var array = [];
    array.hiveAddEach(values);
    return array;
};

Array.unzip = function (table) {
    var transpose = [];
    var length = Infinity;
    // compute shortest row
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        table[i] = row.toArray();
        if (row.length < length) {
            length = row.length;
        }
    }
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        for (var j = 0; j < row.length; j++) {
            if (j < length && j in row) {
                transpose[j] = transpose[j] || [];
                transpose[j][i] = row[j];
            }
        }
    }
    return transpose;
};

function define(key, value) {
    if(!Array.prototype[key])
        Object.defineProperty(Array.prototype, key, {
            value: value,
            writable: true,
            configurable: true,
            enumerable: false
        });
}

define("hiveAddEach", GenericCollection.prototype.hiveAddEach);
define("deleteEach", GenericCollection.prototype.deleteEach);
define("toArray", GenericCollection.prototype.toArray);
define("toObject", GenericCollection.prototype.toObject);
define("all", GenericCollection.prototype.hiveAll);
define("any", GenericCollection.prototype.any);
define("min", GenericCollection.prototype.min);
define("max", GenericCollection.prototype.max);
define("sum", GenericCollection.prototype.sum);
define("average", GenericCollection.prototype.average);
define("only", GenericCollection.prototype.only);
define("flatten", GenericCollection.prototype.flatten);
define("zip", GenericCollection.prototype.zip);
define("enumerate", GenericCollection.prototype.enumerate);
define("group", GenericCollection.prototype.group);
define("sorted", GenericCollection.prototype.sorted);
define("reversed", GenericCollection.prototype.reversed);

define("constructClone", function (values) {
    var clone = new this.constructor();
    clone.hiveAddEach(values);
    return clone;
});

define("has", function (value, equals) {
    return this.find(value, equals) !== -1;
});

define("set", function (index, value) {
    this[index] = value;
    return true;
});

define("hiveAdd", function (value) {
    this.push(value);
    return true;
});

define("delete", function (value, equals) {
    var index = this.find(value, equals);
    if (index !== -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
});

define("deleteAll", function (value, equals) {
    equals = equals || this.contentEquals || Object.equals;
    var count = 0;
    for (var index = 0; index < this.length;) {
        if (equals(value, this[index])) {
            this.swap(index, 1);
            count++;
        } else {
            index++;
        }
    }
    return count;
});

define("find", function (value, equals) {
    equals = equals || this.contentEquals || Object.equals;
    for (var index = 0; index < this.length; index++) {
        if (index in this && equals(value, this[index])) {
            return index;
        }
    }
    return -1;
});

define("findLast", function (value, equals) {
    equals = equals || this.contentEquals || Object.equals;
    var index = this.length;
    do {
        index--;
        if (index in this && equals(this[index], value)) {
            return index;
        }
    } while (index > 0);
    return -1;
});

define("swap", function (start, length, plus) {
    var args, plusLength, i, j, returnValue;
    if (start > this.length) {
        this.length = start;
    }
    if (typeof plus !== "undefined") {
        args = [start, length];
        if (!Array.isArray(plus)) {
            plus = array_slice.call(plus);
        }
        i = 0;
        plusLength = plus.length;
        // 1000 is a magic number, presumed to be smaller than the remaining
        // stack length. For swaps this small, we take the fast path and just
        // use the underlying Array splice. We could measure the exact size of
        // the remaining stack using a try/catch around an unbounded recursive
        // function, but this would defeat the purpose of short-circuiting in
        // the common case.
        if (plusLength < 1000) {
            for (i; i < plusLength; i++) {
                args[i+2] = plus[i];
            }
            return array_splice.apply(this, args);
        } else {
            // Avoid maximum call stack error.
            // First delete the desired entries.
            returnValue = array_splice.apply(this, args);
            // Second batch in 1000s.
            for (i; i < plusLength;) {
                args = [start+i, 0];
                for (j = 2; j < 1002 && i < plusLength; j++, i++) {
                    args[j] = plus[i];
                }
                array_splice.apply(this, args);
            }
            return returnValue;
        }
    // using call rather than apply to cut down on transient objects
    } else if (typeof length !== "undefined") {
        return array_splice.call(this, start, length);
    }  else if (typeof start !== "undefined") {
        return array_splice.call(this, start);
    } else {
        return [];
    }
});

define("peek", function () {
    return this[0];
});

define("poke", function (value) {
    if (this.length > 0) {
        this[0] = value;
    }
});

define("peekBack", function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
});

define("pokeBack", function (value) {
    if (this.length > 0) {
        this[this.length - 1] = value;
    }
});

define("one", function () {
    for (var i in this) {
        if (Object.owns(this, i)) {
            return this[i];
        }
    }
});

if (!Array.prototype.clear) {
    define("clear", function () {
        this.length = 0;
        return this;
    });
}

define("compare", function (that, compare) {
    compare = compare || Object.compare;
    var i;
    var length;
    var lhs;
    var rhs;
    var relative;

    if (this === that) {
        return 0;
    }

    if (!that || !Array.isArray(that)) {
        return GenericOrder.prototype.compare.call(this, that, compare);
    }

    length = Math.min(this.length, that.length);

    for (i = 0; i < length; i++) {
        if (i in this) {
            if (!(i in that)) {
                return -1;
            } else {
                lhs = this[i];
                rhs = that[i];
                relative = compare(lhs, rhs);
                if (relative) {
                    return relative;
                }
            }
        } else if (i in that) {
            return 1;
        }
    }

    return this.length - that.length;
});

define("equals", function (that, equals) {
    equals = equals || Object.equals;
    var i = 0;
    var length = this.length;
    var left;
    var right;

    if (this === that) {
        return true;
    }
    if (!that || !Array.isArray(that)) {
        return GenericOrder.prototype.equals.call(this, that);
    }

    if (length !== that.length) {
        return false;
    } else {
        for (; i < length; ++i) {
            if (i in this) {
                if (!(i in that)) {
                    return false;
                }
                left = this[i];
                right = that[i];
                if (!equals(left, right)) {
                    return false;
                }
            } else {
                if (i in that) {
                    return false;
                }
            }
        }
    }
    return true;
});

define("clone", function (depth, memo) {
    if (depth == null) {
        depth = Infinity;
    } else if (depth === 0) {
        return this;
    }
    memo = memo || new WeakMap();
    if (memo.has(this)) {
        return memo.get(this);
    }
    var clone = new Array(this.length);
    memo.set(this, clone);
    for (var i in this) {
        clone[i] = Object.clone(this[i], depth - 1, memo);
    };
    return clone;
});

define("iterate", function (start, end) {
    return new ArrayIterator(this, start, end);
});

define("Iterator", ArrayIterator);

function ArrayIterator(array, start, end) {
    this.array = array;
    this.start = start == null ? 0 : start;
    this.end = end;
};
ArrayIterator.prototype.__iterationObject = null;
Object.defineProperty(ArrayIterator.prototype,"_iterationObject", {
    get: function() {
        return this.__iterationObject || (this.__iterationObject = { done: false, value:null});
    }
});

ArrayIterator.prototype.next = function () {
    if (this.start === (this.end == null ? this.array.length : this.end)) {
        this._iterationObject.done = true;
        this._iterationObject.value = void 0;
    } else {
        this._iterationObject.value = this.array[this.start++];
    }
    return this._iterationObject;
};
