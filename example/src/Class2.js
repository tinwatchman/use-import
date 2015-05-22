module.exports = (function() {

    var use = require('use-import');
    var Class3 = use('Class3');

    var Class2 = function() {
        this.type = "Class2";
        this.classThree = new Class3();

        this.method = function() {
            console.log("Class2 Method Called!");
            this.classThree.method();
        };
    };

    return Class2;

})();