"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../tag");
/**
 * Merge multiple PackageChangelog into one.
 * `name`, `date` and `version` will be using the values from master changelog. `comments` are merged.
 */
function mergeChangelogs(changelogs, masterPackage) {
    if (changelogs.length < 1 || !masterPackage) {
        return undefined;
    }
    const result = {
        name: masterPackage.name,
        version: masterPackage.version,
        tag: tag_1.generateTag(masterPackage.name, masterPackage.version),
        date: new Date(),
        comments: {},
    };
    changelogs.forEach(changelog => {
        Object.keys(changelog.comments).forEach(changeType => {
            if (changelog.comments[changeType]) {
                result.comments[changeType] = (result.comments[changeType] || []).concat(changelog.comments[changeType]);
            }
        });
    });
    return result;
}
exports.mergeChangelogs = mergeChangelogs;
//# sourceMappingURL=mergeChangelogs.js.map