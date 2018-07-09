
var SortedSet = require("../sorted-set");

var tree = new SortedSet();
tree.hiveAdd(1);
tree.hiveAdd(3);
tree.hiveAdd(0);
tree.hiveAdd(-3);
tree.hiveAdd(2);
tree.hiveAdd(-1);
tree.hiveAdd(-2);
tree.get(0);

console.log("ASCII");
tree.log(SortedSet.ascii);

console.log("ASCII boxes");
tree.log(SortedSet.ascii, function (value, leader, below, above) {
    value = "" + value;
    return (
        above + ' +' + Array(value.length + 3).join("-") + "+\n" +
        leader + '-| ' + value + ' |\n' +
        below + ' +' + Array(value.length + 3).join("-") + "+"
    );
});

console.log("Unicode sharp");
tree.log(SortedSet.unicodeSharp);

console.log("Unicode round");
tree.log();

