describe("UseUtil", function() {
    var util = require('../lib/util');
    var _ = require('underscore');

    describe("getPathMap", function() {
        it("should return a map of module ids to module base paths", function() {
            var module1 = { 'id': 'module1', 'filename': '/modules/module1' },
                module2 = { 'id': 'module2', 'filename': '/modules/module2' },
                map = {};
            var r = util.getPathMap(module1, module2, map);
            expect(r.module1).toEqual('/modules/module1');
            expect(r.module2).toEqual('/modules/module2');
            expect(r[require.main.id]).toEqual(require.main.filename);
        });

        it("shouldn't return more than one entry if modules are identical", function() {
            var module1 = { 'id': 'module1', 'filename': '/modules/module1' },
                map = {};
            var r = util.getPathMap(module1, module1, map);
            expect(_.keys(r).length).toEqual(2);
        });

        it("shouldn't return a path for a module that's already been loaded", function() {
            var module1 = { 'id': 'module1', 'filename': '/modules/module1' },
                map = { 'module1': null };
            var r = util.getPathMap(module1, module1, map);
            expect(_.keys(r).length).toEqual(1);
        });
    });
    
    describe("findNamePath", function() {
        it("should search a map for a name and return its value if found", function() {
            var name = "MyClass",
                parentModule = { 'id': 'MyModule' },
                map = {
                    'MyModule': {
                        'MyClass': '.'
                    }
                };
            var r = util.findNamePath(name, map, parentModule);
            expect(r).not.toBeNull();
            expect(r).toEqual('.');
        });

        it("should return null if a name isn't found", function() {
            var name = "MyOtherClass",
                parentModule = { 'id': 'MyModule' },
                map = {
                    'MyModule': {
                        'MyClass': '.'
                    }
                };
            var r = util.findNamePath(name, map, parentModule);
            expect(r).toBeNull();
        });

        it("should search all modules, not just the parent module", function() {
            var name = "MyOtherClass",
                parentModule = { 'id': 'MyModule' },
                map = {
                    'MyModule': {
                        'MyClass': './MyClass'
                    },
                    'MyOtherModule': {
                        'MyOtherClass': './MyOtherClass'
                    }
                };
            var r = util.findNamePath(name, map, parentModule);
            expect(r).toEqual('./MyOtherClass');
        });

        it("should be able to handle unexpected parent module values", function() {
            var name = "MyClass",
                map = {
                    'MyModule': {
                        'MyClass': './MyClass'
                    }
                };
            var r = util.findNamePath(name, map, undefined);
            expect(r).toEqual('./MyClass');
        });
    });
});