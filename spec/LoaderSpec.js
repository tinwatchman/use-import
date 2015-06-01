describe("UseLoader", function() {
    var UseLoader = require('../lib/loader');
    var fs = require('fs-extra');
    var path = require('path');
    var UseMap = require('../lib/UseMap');

    var loader;
    var tmpDir = path.join(__dirname, "./UseLoaderJasmine" + Date.now() + "/");

    beforeAll(function() {
        fs.ensureDirSync(tmpDir);
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

    describe("load", function() {
        var root = path.join(tmpDir, './root/'),
            rootPath = path.join(root, './index.js');

        beforeEach(function() {
            fs.ensureDirSync(root);
        });

        afterEach(function() {
            fs.removeSync(root);
        });

        it("should configure a UseMap object with data from a use.json file", function() {
            // set up
            var configFilePath = path.join(root, "./use.json"),
                useMap = new UseMap();
            fs.writeJsonSync(configFilePath, {"name": "./path"});
            // load
            var result = loader.load(rootPath, useMap);
            expect(result).toBe(true);
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.map.name).toEqual(path.join(root, "./path"));
            expect(useMap.isFileLoaded(configFilePath)).toBe(true);
        });

        it("should be able to handle data from a project.json file", function() {
            var useMap = new UseMap(),
                configPath = path.join(root, "./project.json"),
                projectData = {
                    "namespace": {
                        "map": {
                            "name": "./path"
                        }
                    },
                    "srcDir": "./src"
                };
            fs.writeJsonSync(configPath, projectData);
            // load
            var result = loader.load(rootPath, useMap);
            expect(result).toBe(true);
            expect(useMap.isConfigured).toBe(true);
            expect(useMap.map.name).toEqual(path.join(root, "./src", "./path"));
        });

        it("should return false when a config file isn't found", function() {
            var useMap = new UseMap();
            var result = loader.load(rootPath, useMap);
            expect(result).toBe(false);
            expect(useMap.isConfigured).toBe(false);
        });
    });
});