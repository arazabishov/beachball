"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../tag");
function getPackageChangelogs(changeSet, packageInfos) {
    const changelogs = {};
    for (let change of changeSet.values()) {
        const { packageName } = change;
        if (!changelogs[packageName]) {
            const version = packageInfos[packageName].version;
            changelogs[packageName] = {
                name: packageName,
                version,
                tag: tag_1.generateTag(packageName, version),
                date: new Date(),
                comments: {},
            };
        }
        changelogs[packageName].comments = changelogs[packageName].comments || {};
        changelogs[packageName].comments[change.type] = changelogs[packageName].comments[change.type] || [];
        changelogs[packageName].comments[change.type].push({
            comment: change.comment,
            author: change.email,
            commit: change.commit,
            package: packageName,
        });
    }
    return changelogs;
}
exports.getPackageChangelogs = getPackageChangelogs;
//# sourceMappingURL=getPackageChangelogs.js.map