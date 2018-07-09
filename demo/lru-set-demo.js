
var LruSet = require("../lru-set");

var set = new LruSet([1, 2, 3], 3);
console.log(set.toArray());

set.get(2);
console.log(set.toArray());

set.hiveAdd(4);
console.log(set.toArray());

set.hiveAdd(2);
console.log(set.toArray());

