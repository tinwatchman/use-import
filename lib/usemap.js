module.exports = (function() {
    "use strict";
    
    var _ = require('underscore');
    var pathlib = require('path');

    var UseMap = function() {
        this.rootDir = null;
        this.map = {};
        this.isConfigured = false;

        var self = this;

        /**
         * Configures the map.
         * @param  {Object} nameMap Object containing name => relative path 
         *                          value pairs
         * @param  {String} rootDir Optional. Project root directory.
         * @param  {String} srcDir  Optional. Project source directory (within 
         *                          root).
         * @return {void}
         */
        this.config = function(nameMap) {
            // optional rootDir argument
            var rootDir;
            if (arguments.length > 1 && _.isString(arguments[1])) {
                rootDir = arguments[1];
            } else if (this.rootDir !== null) {
                rootDir = this.rootDir;
            } else {
                throw new Error("PROJECT_ROOT_DIR_NOT_DEFINED");
            }
            // optional srcDir argument
            var srcDir;
            if (arguments.length > 2 && _.isString(arguments[2])) {
                srcDir = arguments[2];
            }
            // add new names to map; resolve paths to absolute
            for (var name in nameMap) {
                if (_.isUndefined(srcDir)) {
                    this.map[name] = pathlib.join(rootDir, nameMap[name]);
                } else {
                    this.map[name] = pathlib.join(rootDir, srcDir, nameMap[name]);
                }
            }
            // save root dir if it hasn't been set
            if (this.rootDir === null) {
                this.rootDir = rootDir;
            }
            this.isConfigured = true;
        };

        /**
         * Gets module path for name (if found)
         * @param  {String} name Module name
         * @return {String}      Module path if found, undefined otherwise
         */
        this.getPath = function(name) {
            if (_.has(this.map, name) && !_.isEmpty(this.map[name])) {
                return this.map[name];
            }
            return undefined;
        };

        /** Getter for length */
        this.__defineGetter__('length', function() {
            return _.keys(self.map).length;
        });
    };

    return UseMap;
})();