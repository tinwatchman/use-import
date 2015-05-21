module.exports = (function() {
    "use strict";

    var _ = require('underscore');

    var UseLoader = require('./lib/loader');
    var util = require('./lib/util');

    var UseImporter = function() {
        var self = this,
            map = {},
            initialParent = module.parent,
            isLoaded = false;

        this.use = function(name) {
            if (!isLoaded || !_.has(map, module.parent.id)) {
                self.load();
            }
            var namePath = util.findNamePath(name, map, module.parent);
            if (namePath === null) {
                throw new Error("MODULE_NOT_FOUND");
            }
            return require(namePath);
        };
        
        this.use.__defineGetter__('map', function() {
            return map;
        });

        this.load = function() {
            var pathMap = util.getPathMap(module.parent, initialParent, map);
            var loader = new UseLoader();
            var result = loader.load(pathMap);
            map = _.extend({}, map, result);
            isLoaded = true;
        };
    };

    if (!global.use) {
        var useImporter = new UseImporter();
        global.use = useImporter.use;
    }
})();