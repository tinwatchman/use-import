module.exports = (function() {
    "use strict";

    var _ = require('underscore');
    var pathlib = require('path');

    var UseMap = require('./lib/usemap');
    var UseLoader = require('./lib/loader');

    var UseImporter = function() {
        var self = this,
            useMap = new UseMap();

        // public api
        
        /**
         * Require module by name
         * @param  {String} name Valid/configured name for module
         * @return {*}
         */
        this.use = function(name) {
            if (!useMap.isConfigured) {
                throw new Error("USE_IMPORTER_NOT_CONFIGURED");
            }
            var namePath = useMap.getPath(name);
            if (_.isUndefined(namePath)) {
                throw new Error("USE_IMPORTER_MODULE_NOT_FOUND");
            }
            return require(namePath);
        };

        /**
         * Loads config information from a use.json or project.json file on the
         * requesting module's filepath
         * @return {Function} Returns the use function. Useful for chaining.
         */
        this.use.load = function() {
            self.load();
            return self.use;
        };

        /**
         * Configures use-import
         * @param  {Object} map     Object with name => module relative path 
         *                          key-value pairs.
         * @param  {String} rootDir Optional. The root directory the module 
         *                          paths are given in relation to. Defaults to
         *                          the root directory of the first module to
         *                          require use-import. 
         * @return {Function}       Returns the `use` function. Useful for 
         *                          chaining.
         */
        this.use.config = function(map) {
            if (arguments.length > 1 && !_.isEmpty(arguments[1])) {
                useMap.config(map, arguments[1]);
            } else if (!useMap.isConfigured) {
                useMap.config(map, pathlib.dirname(module.parent.filename));
            } else {
                useMap.config(map);
            }
            return self.use;
        };

        // protected functions

        this.load = function() {
            if (!useMap.isConfigured) {
                var loader = new UseLoader();
                var r = loader.load(module.parent.filename, useMap);
                if (!r) {
                    throw new Error("USE_IMPORTER_CONFIG_FILE_NOT_FOUND");
                }
            } else {
                throw new Error("USE_IMPORTER_LOAD_CALLED_TWICE");
            }
        };
    };

    var useImporter = new UseImporter();
    return useImporter.use;
})();