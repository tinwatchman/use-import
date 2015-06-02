module.exports = (function() {
	"use strict";
	
	/**
	 * Common utility functions
	 */
	
	/**
	 * Replaces Windows-style backslashes in filepaths with Unix-style 
	 * forward-slashes for consistency
	 * @param  {String} path A filepath
	 * @return {String}      Path with all backslashes converted
	 */
	var replaceBackSlashes = function(path) {
	    while (path.search(/\\/i) > -1) {
	        path = path.replace(/\\/i, '/');
	    }
	    return path;
	};

	return {
		'replaceBackSlashes': replaceBackSlashes
	};

})();