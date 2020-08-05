"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageGroups_1 = require("../monorepo/getPackageGroups");
function setGroupsInBumpInfo(bumpInfo, options) {
    bumpInfo.packageGroups = getPackageGroups_1.getPackageGroups(bumpInfo.packageInfos, options.path, options.groups);
    if (options.groups) {
        for (const grpName of Object.keys(bumpInfo.packageGroups)) {
            const grpOptions = options.groups.find(groupItem => groupItem.name === grpName);
            bumpInfo.groupOptions[grpName] = grpOptions;
        }
    }
}
exports.setGroupsInBumpInfo = setGroupsInBumpInfo;
//# sourceMappingURL=setGroupsInBumpInfo.js.map