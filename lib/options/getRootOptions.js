"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
function getRootOptions() {
    const configExplorer = cosmiconfig_1.cosmiconfigSync('beachball');
    const searchResults = configExplorer.search();
    if (searchResults && searchResults.config) {
        return searchResults.config;
    }
    return {};
}
exports.getRootOptions = getRootOptions;
//# sourceMappingURL=getRootOptions.js.map