"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getChangedPackages_1 = require("../changefile/getChangedPackages");
function isChangeFileNeeded(options) {
    const { branch } = options;
    console.log(`Checking for changes against "${branch}"`);
    const changedPackages = getChangedPackages_1.getChangedPackages(options);
    if (changedPackages.length > 0) {
        console.log(`Found changes in the following packages: ${[...changedPackages]
            .sort()
            .map(pkg => `\n  ${pkg}`)
            .join('')}`);
    }
    return changedPackages.length > 0;
}
exports.isChangeFileNeeded = isChangeFileNeeded;
//# sourceMappingURL=isChangeFileNeeded.js.map