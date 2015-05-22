module.exports = (function() {

    var use = require('use-import');
    var Class2 = use('Class2');

    var Class1 = function() {
        this.type = "Class1";
        this.classTwo = new Class2();

        this.method = function() {
            console.log("Class1 Method Called!");
            this.classTwo.method();
        };
    };

    return Class1;

})();