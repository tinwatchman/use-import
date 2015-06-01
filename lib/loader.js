module.exports = (function() {
    "use strict";

    var findup = require('findup');
    var fs = require('fs-extra');
    var path = require('path');
    var _ = require('underscore');

    var UseLoader = function() {

        /**
         * Finds a use.json or project.json file in the project root and 
         * configures the given UseMap object with its data.
         * @param  {String}  startPath Filepath of the calling module
         * @param  {UseMap}  useMap    UseMap object
         * @return {Boolean}           True if file found, false otherwise
         */
        this.load = function(startPath, useMap) {
            var configPath = this.searchPath(startPath);
            if (configPath !== null) {
                return this.loadFile(configPath, useMap);
            }
            return false;
        };

        /**
         * Directly loads configuration data from the given path.
         * @param  {String}  filePath Path to JSON config file to load
         * @param  {UseMap}  useMap   UseMap object
         * @return {Boolean}          True if file loaded, false otherwise
         */
        this.loadFile = function(filePath, useMap) {
            if (!useMap.isFileLoaded(filePath)) {
                try {
                    var data = fs.readJsonSync(filePath),
                        rootDir = path.dirname(filePath),
                        srcDir,
                        config;
                    if (filePath.search(/\/project\.json$/i) > -1 && 
                        _.has(data, 'namespace') && _.has(data.namespace, 'map')) {
                        // read project.json file
                        config = data.namespace.map;
                        if (_.has(data, 'srcDir') && data.srcDir !== null &&
                            !_.isEmpty(data.srcDir)) {
                            srcDir = data.srcDir;
                        }
                    } else {
                        // if a use.json file
                        config = data;
                    }
                    // configure usemap
                    if (_.isUndefined(srcDir)) {
                        useMap.config(config, {
                            'rootDir': rootDir,
                            'file': filePath
                        });
                    } else {
                        useMap.config(config, {
                            'rootDir': rootDir,
                            'srcDir': srcDir,
                            'file': filePath
                        });
                    }
                    return true;
                } catch (err) {
                }
            }
            return false;
        };

        /**
         * Searches given file path for config files
         * @param  {String} filePath A file path
         * @return {String}          Config file path if found, null otherwise
         */
        this.searchPath = function(filePath) {
            var startDir = path.dirname(filePath),
                rootDir = null,
                configPath = null;
            try {
                rootDir = findup.sync(startDir, 'use.json');
                configPath = path.join(rootDir, './use.json');
            } catch (e) {
                rootDir = null;
            }
            if (_.isUndefined(rootDir) || rootDir === null) {
                try {
                    rootDir = findup.sync(startDir, 'project.json');
                    configPath = path.join(rootDir, './project.json');
                } catch (e) {
                    rootDir = null;
                }
            }
            return configPath;
        };
               
    };

    return UseLoader;

})(); 