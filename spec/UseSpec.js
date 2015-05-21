describe("UseImporter", function() {
    require('../useimport');
    var fs = require('fs-extra');
    var path = require('path');
    var _ = require('underscore');
    

    it("should automatically create a global function called use when required", function() {
        expect(use).toBeDefined();
        expect(_.isFunction(use)).toBe(true);
    });

    describe("use.map", function() {
        it("should return the base map the use function is running off of", function() {
            expect(use.map).toBeDefined();
            expect(_.keys(use.map).length).toEqual(0);
        });
    });

    describe("use", function() {
        var useJsonPath = path.join(__dirname, "./use.json");
        var myClassPath = path.join(__dirname, "./MyClass.js");

        beforeEach(function() {
            fs.writeJsonSync(useJsonPath, {
                "MyClass": "./MyClass"
            });
            fs.writeFileSync(myClassPath, "module.exports = { hello: 'Hello!' };", {'encoding':'utf8'});
        });

        afterEach(function() {
            fs.removeSync(useJsonPath);
            fs.removeSync(myClassPath);
        });

        it("should load a use.json file in the loading module's root directory", function() {
            var MyClass = use('MyClass');
            expect(use.map[module.id]).toBeDefined();
            expect(use.map[module.id].MyClass).toEqual(path.join(__dirname, "./MyClass"));
        });

        it("should return the proper file in response to the given name", function() {
            var MyClass = use('MyClass');
            expect(MyClass.hello).toBeDefined();
            expect(MyClass.hello).toEqual("Hello!");
        });
    });
});