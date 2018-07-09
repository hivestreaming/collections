
require("../observable-object");

var object = {};

Object.hiveAddOwnPropertyChangeListener(object, 'a', function (value, key, object) {
    console.log('changed', value);
});

object.a = 10;
object.a = 20;

