describe("UseMap", function() {
    var UseMap = require('../lib/usemap');
    var useMap;

    beforeEach(function() {
        useMap = new UseMap();
    });

    describe("config", function() {
        it("should accept a map of name-path pairs, and resolve the paths relative to the given root directory", function() {
            var nameMap = {
                'name1': './src/package/module1',
                'name2': './src/package/subpackage/module2',
                'name3': './lib/module3'
            };
            useMap.config(nameMap, {
                rootDir: "/Users/someone/project/"
            });
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.length).toEqual(3);
            expect(useMap.map.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(useMap.map.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(useMap.map.name3).toEqual("/Users/someone/project/lib/module3");
        });

        it("should hold onto the first valid rootDir it sees for future reference", function() {
            var nameMap = {
                'name1': './src/package/module1'
            };
            useMap.config(nameMap, {
                rootDir: "/Users/someone/project/"
            });
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.rootDir).not.toBeNull();
            expect(useMap.rootDir).toEqual("/Users/someone/project/");
        });

        it("should add additional config options as provided, and resolve them with the cached rootDir", function() {
            var map1 = {
                    'name1': './src/package/module1'
                },
                map2 = {
                    'name2': './src/package/subpackage/module2',
                    'name3': './lib/module3'
                };
            useMap.config(map1, {
                rootDir: "/Users/someone/project/"
            });
            useMap.config(map2);
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.length).toEqual(3);
            expect(useMap.map.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(useMap.map.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(useMap.map.name3).toEqual("/Users/someone/project/lib/module3");
        });

        it("should allow a different root dir to be passed in, without overwriting the original rootDir", function() {
            var map1 = {
                    'name1': './src/package/module1'
                },
                map2 = {
                    'name2': './package/subpackage/module2',
                    'name3': './module3'
                };
            useMap.config(map1, {
                rootDir: "/Users/someone/project/"
            });
            useMap.config(map2, {
                rootDir: "/Users/someone/project/subproj/"
            });
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.length).toEqual(3);
            expect(useMap.map.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(useMap.map.name2).toEqual("/Users/someone/project/subproj/package/subpackage/module2");
            expect(useMap.map.name3).toEqual("/Users/someone/project/subproj/module3");
            expect(useMap.rootDir).toEqual("/Users/someone/project/");
        });

        it("should support an additional srcDir argument", function() {
            var nameMap = {
                'name1': './package/module1',
                'name2': './package/subpackage/module2',
                'name3': './module3'
            };
            useMap.config(nameMap, {
                rootDir: "/Users/someone/project/",
                srcDir: "./src"
            });
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.length).toEqual(3);
            expect(useMap.map.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(useMap.map.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(useMap.map.name3).toEqual("/Users/someone/project/src/module3");
        });

        it("should throw an error when rootDir is not defined", function() {
            var nameMap = {
                'name1': './package/module1',
                'name2': './package/subpackage/module2',
                'name3': './module3'
            };
            var err;
            try {
                useMap.config(nameMap);
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
            expect(err.message).toEqual("PROJECT_ROOT_DIR_NOT_DEFINED");
        });
    });

    describe("getPath", function() {
        beforeEach(function() {
            useMap.config({
                    'name1': './package/module1',
                    'name2': './package/subpackage/module2',
                    'name3': './module3'
                },
                {
                    rootDir: "/Users/someone/project/",
                    srcDir: "./src"
                }
            );
        });

        it("should return a path for a valid name", function() {
            var p = useMap.getPath('name1');
            expect(p).toBeDefined();
            expect(p).toEqual("/Users/someone/project/src/package/module1");
        });

        it("should return undefined for an invalid name", function() {
            var p = useMap.getPath('name0');
            expect(p).not.toBeDefined();
        });
    });

    describe("isFileLoaded", function() {
        it("should return true when a certain config file has already been loaded", function() {
            useMap.config({
                    'name1': './package/module1',
                    'name2': './package/subpackage/module2',
                    'name3': './module3'
                },
                {
                    rootDir: "/Users/someone/project/",
                    file: "/Users/someone/project/use.json"
                }
            );
            expect(useMap.isFileLoaded("/Users/someone/project/use.json")).toEqual(true);
            expect(useMap.isFileLoaded("/Users/someone/otherProject/use.json")).toEqual(false);
        });
    });
});