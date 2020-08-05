"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDisallowedChangeTypes(packageName, packageInfos, packageGroups) {
    for (const groupName of Object.keys(packageGroups)) {
        const groupsInfo = packageGroups[groupName];
        if (groupsInfo.packageNames.indexOf(packageName) > -1) {
            return groupsInfo.disallowedChangeTypes;
        }
    }
    return packageInfos[packageName].options.disallowedChangeTypes;
}
exports.getDisallowedChangeTypes = getDisallowedChangeTypes;
//# sourceMappingURL=getDisallowedChangeTypes.js.map