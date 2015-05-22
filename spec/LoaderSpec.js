describe("UseLoader", function() {
    var UseLoader = require('../lib/loader');
    var fs = require('fs-extra');
    var os = require('os');
    var path = require('path');

    var loader;
    var tmpDir = path.join(os.tmpdir(), "./UseLoaderJasmine" + Date.now() + "/");

    beforeAll(function() {
        fs.ensureDir(tmpDir);
    });

    beforeEach(function() {
        loader = new UseLoader();
    });

    afterAll(function() {
        fs.removeSync(tmpDir);
    });

    describe("searchPath", function() {
        var root = path.join(tmpDir, "./root/"),
            level2 = path.join(root, "./level2/"),
            level3 = path.join(level2, "./level3/")

        beforeAll(function() {
            fs.ensureDirSync(level3);
        });

        beforeEach(function() {
            fs.emptyDirSync(root);
            fs.emptyDirSync(level2);
            fs.emptyDirSync(level3);
        });

        afterAll(function() {
            fs.removeSync(root);
        });

        it("should search the given path for a use.json file and return the file's path if found", function() {
            var configFilePath = path.join(root, "./use.json"),
                startPoint = path.join(level3, "./index.js");
            fs.outputJsonSync(configFilePath, { "name": "path" });
            var r = loader.searchPath(startPoint);
            expect(r).toEqual(configFilePath);
        });

        it("should search the given path for a project.json file and return the file's path if found", function() {
            var configFilePath = path.join(root, "./project.json"),
                startPoint = path.join(level3, "./index.js");
            fs.writeJsonSync(configFilePath, { "name": "path" });
            var r = loader.searchPath(startPoint);
            expect(r).toEqual(configFilePath);
        });

        it("should prefer use.json files over project.json files", function() {
            var useFilePath = path.join(root, "./use.json"),
                projFilePath = path.join(root, "./project.json"),
                startPoint = path.join(level3, "./index.js");
            fs.ensureFileSync(useFilePath);
            fs.ensureFileSync(projFilePath);
            var r = loader.searchPath(startPoint);
            expect(r).toEqual(useFilePath);
        });

        it("should return null when file is not found", function() {
            var startPoint = path.join(level3, './index.js');
            var r = loader.searchPath(startPoint);
            expect(r).toBeNull();
        });
    });

    describe("resolveFileMap", function() {
        it("should return a name-filepath map with the filepaths resolved to the project root directory", function() {
            var baseFile = "/Users/someone/project/use.json";
            var pathMap = {
                'name1': './src/package/module1',
                'name2': './src/package/subpackage/module2',
                'name3': './lib/module3'
            };
            var r = loader.resolveFileMap(baseFile, pathMap);
            expect(r).not.toBeNull();
            expect(r.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(r.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(r.name3).toEqual("/Users/someone/project/lib/module3");
        });

        it("should return the same results with a project.json file", function() {
            var baseFile = "/Users/someone/project/project.json";
            var pathMap = {
                'namespace': {
                    'map': {
                        'name1': './src/package/module1',
                        'name2': './src/package/subpackage/module2',
                        'name3': './lib/module3'
                    }
                }
            };
            var r = loader.resolveFileMap(baseFile, pathMap);
            expect(r).not.toBeNull();
            expect(r.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(r.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(r.name3).toEqual("/Users/someone/project/lib/module3");
        });

        it("should support srcDir in a project.json file", function() {
            var baseFile = "/Users/someone/project/project.json";
            var pathMap = {
                'namespace': {
                    'map': {
                        'name1': './package/module1',
                        'name2': './package/subpackage/module2',
                        'name3': './lib/module3'
                    }
                },
                'srcDir': './src'
            };
            var r = loader.resolveFileMap(baseFile, pathMap);
            expect(r).not.toBeNull();
            expect(r.name1).toEqual("/Users/someone/project/src/package/module1");
            expect(r.name2).toEqual("/Users/someone/project/src/package/subpackage/module2");
            expect(r.name3).toEqual("/Users/someone/project/src/lib/module3");
        });
    });
});