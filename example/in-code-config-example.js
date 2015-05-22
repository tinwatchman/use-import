console.log("Use-Import: In-Code Configuration Example");

var use = require('use-import').config({
    "Class1": "./src/Class1",
    "Class2": "./src/Class2",
    "Class3": "./src/some/insane/directory/structure/Class3"
});

var Class1 = use('Class1');
var classOne = new Class1();
classOne.method();
