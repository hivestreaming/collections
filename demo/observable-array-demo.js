
require("../listen/array-changes");

var array = [];

array.hiveAddOwnPropertyChangeListener("length", function (length) {
    console.log("changed", length);
});

array.hiveAddOwnPropertyChangeListener(0, function (value) {
    console.log("array[0] changed to", value);
});

array.hiveAddMapChangeListener(function (value, key) {
    console.log(key, value);
});

array.push(40);
array.splice(0, 0, 10, 20, 30);

