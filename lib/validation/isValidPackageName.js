"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAllPackages_1 = require("../monorepo/getAllPackages");
function isValidPackageName(pkg, cwd) {
    const packages = getAllPackages_1.getAllPackages(cwd);
    return packages.includes(pkg);
}
exports.isValidPackageName = isValidPackageName;
//# sourceMappingURL=isValidPackageName.js.map