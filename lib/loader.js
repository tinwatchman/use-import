module.exports = (function() {
    "use strict";

    var findup = require('findup');
    var fs = require('fs-extra');
    var path = require('path');
    var _ = require('underscore');

    var UseLoader = function() {

        /**
         * Searches module paths for config files
         * and loads them if found.
         * @param  {Object} pathMap Map of module.ids => module.filenames
         * @return {Object}         Map of module.ids => loaded config file (if 
         *                          found) or null (if not found)
         */
        this.load = function(pathMap) {
            var map = {},
                configFile,
                data;
            for (var moduleId in pathMap) {
                configFile = this.searchPath(pathMap[moduleId]);
                if (configFile !== null) {
                    data = fs.readJsonSync(configFile);
                    map[moduleId] = this.resolveFileMap(configFile, data);
                } else {
                    map[moduleId] = null;
                }
            }
            return map;
        };

        /**
         * Searches given file path for config files
         * @param  {String} filePath A file path
         * @return {String}          Config file path if found, null otherwise
         */
        this.searchPath = function(filePath) {
            var startDir = path.dirname(filePath),
                rootDir = null,
                filePath = null;
            try {
                rootDir = findup.sync(startDir, 'use.json');
                filePath = path.join(rootDir, './use.json');
            } catch (e) {
                rootDir = null;
            }
            if (_.isUndefined(rootDir) || rootDir === null) {
                try {
                    rootDir = findup.sync(startDir, 'project.json');
                    filePath = path.join(rootDir, './project.json');
                } catch (e) {
                    rootDir = null;
                }
            }
            return filePath;
        };

        /**
         * Resolves a map of relative file paths to absolute file paths (based
         * on the module's root directory)
         * @param  {String} configPath Absolute path to config file
         * @param  {Object} nameMap    Map of names => relative file paths
         * @return {Object}            Map of names => absolute file paths
         */
        this.resolveFileMap = function(configPath, nameMap) {
            var rootDir = path.dirname(configPath),
                map;
            if (configPath.search(/\/project\.json$/i) > -1 && 
                _.has(nameMap, 'namespace')) {
                map = nameMap.namespace.map;
            } else {
                map = nameMap;
            }
            return _.mapObject(map, function(filePath) {
                return path.join(rootDir, filePath);
            });
        };
        
    };

    return UseLoader;

})(); 