"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidChangelogOptions(options) {
    if (options.groups) {
        if (!isValidChangelogGroupOptions(options.groups)) {
            return false;
        }
    }
    return true;
}
exports.isValidChangelogOptions = isValidChangelogOptions;
function isValidChangelogGroupOptions(groupOptions) {
    for (const options of groupOptions) {
        if (!options.changelogPath) {
            console.log('changelog group options cannot contain empty changelogPath.');
            return false;
        }
        if (!options.masterPackageName) {
            console.log('changelog group options cannot contain empty masterPackageName.');
            return false;
        }
        if (!options.include) {
            console.log('changelog group options cannot contain empty include.');
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=isValidChangelogOptions.js.map