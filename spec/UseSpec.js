describe("UseImporter", function() {
    var fs = require('fs-extra');
    var path = require('path');
    var _ = require('underscore');
    
    describe("use and use.load", function() {
        var useJsonPath = path.join(__dirname, "./use.json");
        var myClassPath = path.join(__dirname, "./MyClass.js");

        beforeEach(function() {
            fs.writeJsonSync(useJsonPath, {
                "MyClass": "./MyClass"
            });
            fs.writeFileSync(myClassPath, 
                             "module.exports = { hello: 'Hello!' };", 
                             {'encoding':'utf8'}
                            );
        });

        afterEach(function() {
            fs.removeSync(useJsonPath);
            fs.removeSync(myClassPath);
        });

        it("should load a use.json file in the loading module's root " +
           "directory, and return the proper file in response to the given " + 
           "name", function() {
            var use = require('../useimport').load();
            var MyClass = use('MyClass');
            expect(use).toBeDefined();
            expect(_.isFunction(use)).toBe(true);
            expect(MyClass).toBeDefined();
            expect(MyClass.hello).toEqual("Hello!");
        });
    });

    describe("use and use.config", function() {
        var myClassPath = path.join(__dirname, "./MyClass.js");

        beforeEach(function() {
            fs.writeFileSync(myClassPath, 
                             "module.exports = { hello: 'Hello!' };", 
                             {'encoding':'utf8'}
                            );
        });

        afterEach(function() {
            fs.removeSync(myClassPath);
        });

        it("should be configurable when first called", function() {
            var use = require('../useimport').config({
                "MyClass": "./MyClass"
            });
            var MyClass = use('MyClass');
            expect(use).toBeDefined();
            expect(_.isFunction(use)).toBe(true);
            expect(MyClass).toBeDefined();
            expect(MyClass.hello).toEqual("Hello!");
        });
    });
});