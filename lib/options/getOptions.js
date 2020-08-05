"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCliOptions_1 = require("./getCliOptions");
const getRootOptions_1 = require("./getRootOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
/**
 * Gets all repo level options (default + root options + cli options)
 */
function getOptions() {
    return Object.assign(Object.assign(Object.assign({}, getDefaultOptions_1.getDefaultOptions()), getRootOptions_1.getRootOptions()), getCliOptions_1.getCliOptions());
}
exports.getOptions = getOptions;
//# sourceMappingURL=getOptions.js.map