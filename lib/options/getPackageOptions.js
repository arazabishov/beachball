"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const getCliOptions_1 = require("./getCliOptions");
const getRootOptions_1 = require("./getRootOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
/**
 * Gets all package level options (default + root options + package options + cli options)
 */
function getPackageOptions(packagePath) {
    const configExplorer = cosmiconfig_1.cosmiconfigSync('beachball', { cache: false });
    const searchResults = configExplorer.search(packagePath);
    const defaultOptions = getDefaultOptions_1.getDefaultOptions();
    const rootOptions = getRootOptions_1.getRootOptions();
    return Object.assign(Object.assign(Object.assign(Object.assign({}, defaultOptions), rootOptions), (searchResults && searchResults.config)), getCliOptions_1.getCliOptions());
}
exports.getPackageOptions = getPackageOptions;
//# sourceMappingURL=getPackageOptions.js.map