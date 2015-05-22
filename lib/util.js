module.exports = (function() {
    "use strict";

    var _ = require('underscore');

    var UseUtil = function() {
        var self = this;

        this.findNamePath = function(name, map, parentModule) {
            if (this.isModule(parentModule) &&
                _.has(map, parentModule.id) &&
                !_.isNull(map[parentModule.id]) &&
                _.has(map[parentModule.id], name)) {
                return map[parentModule.id][name];
            }
            for (var moduleId in map) {
                if (map[moduleId] !== null &&
                    _.has(map[moduleId], name)) {
                    return map[moduleId][name];
                }
            }
            return null;
        };

        this.getPathMap = function(parentModule, initialParent, map) {
            var pathMap = {};
            if (this.isModule(parentModule) && !_.has(map, parentModule.id)) {
                pathMap[parentModule.id] = parentModule.filename;
            }
            if (initialParent !== parentModule &&
                !_.has(map, initialParent.id)) {
                pathMap[initialParent.id] = initialParent.filename;
            }
            if (require.main !== parentModule &&
                require.main !== initialParent &&
                !_.has(map, require.main.id)) {
                pathMap[require.main.id] = require.main.filename;
            }
            return pathMap;
        };

        this.isModule = function(obj) {
            return (
                !_.isUndefined(obj) && 
                !_.isNull(obj) && 
                !_.isUndefined(obj.id) &&
                !_.isEmpty(obj.id) &&
                !_.isUndefined(obj.filename)
            );
        };

        this.hasBaseModule = function(moduleObj, map) {
            var c = moduleObj;
            while (this.isModule(c)) {
                if (_.has(map, c.id)) {
                    return true;
                }
                c = !_.isUndefined(c.parent) ? c.parent : null;
            }
            return false;
        };



        this.isChildModule = function(module, parent) {
            var mod = module,
                isModule = this.isModule(module);
            console.log("id %s, isModule %s", mod.id, isModule);
            while (isModule) {
                if (mod.parent === parent) {
                    return true;
                }
                mod = mod.parent;
                isModule = this.isModule(mod);
            }
            return false;
        };
    };

    return new UseUtil();

})();