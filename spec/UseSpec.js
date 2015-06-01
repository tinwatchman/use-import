describe("UseImporter", function() {
    var fs = require('fs-extra');
    var path = require('path');
    var _ = require('underscore');

    describe("use, use.load, and use.isLoaded", function() {
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

        it("should throw an error when use.load has already been " + 
            "called", function() {
            var err = null;
            try {
                var use = require('../useimport').load();
            } catch (e) {
                err = e;
            }
            expect(err).not.toBeNull();
            expect(err.message).toEqual("USE_IMPORTER_LOAD_CALLED_TWICE");
        });

        describe("use.isLoaded", function() {
            it("should return true when load has been called", function() {
                var use = require('../useimport');
                expect(use.isLoaded).toBe(true);
            });
        });
    });

    describe("use.unload", function() {
        it("should exist", function() {
            var use = require('../useimport');
            expect(use.unload).toBeDefined();
            expect(_.isFunction(use.unload)).toBe(true);
        });

        it("should clear all loaded data", function() {
            var use = require('../useimport');
            expect(use.isLoaded).toBe(true);
            use.unload();
            expect(use.isLoaded).toBe(false);
        });
    });

    describe("use.load filePath parameter", function() {
        var jsonPath = path.join(__dirname, "./something.json");

        beforeEach(function() {
            fs.writeJsonSync(jsonPath, {
                "MyClass": "./MyClass"
            });
        });

        afterEach(function() {
            fs.removeSync(jsonPath);
        });

        it("should load config data from a specific file path", function() {
            var use = require("../useimport").load(jsonPath);
            var p = use.resolve("MyClass");
            expect(p).toEqual(path.join(__dirname, "./MyClass"));
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