"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageInfos_1 = require("./getPackageInfos");
function getAllPackages(cwd) {
    const infos = getPackageInfos_1.getPackageInfos(cwd);
    return Object.keys(infos);
}
exports.getAllPackages = getAllPackages;
//# sourceMappingURL=getAllPackages.js.map