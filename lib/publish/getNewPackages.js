"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const listPackageVersions_1 = require("../packageManager/listPackageVersions");
function getNewPackages(bumpInfo, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        const { modifiedPackages, packageInfos } = bumpInfo;
        const newPackages = Object.keys(packageInfos).filter(pkg => !modifiedPackages.has(pkg));
        const publishedVersions = yield listPackageVersions_1.listPackageVersions(newPackages, registry);
        return newPackages.filter(pkg => {
            const packageInfo = packageInfos[pkg];
            // Ignore private packages or change type "none" packages
            if (packageInfo.private) {
                return false;
            }
            if (!publishedVersions[pkg] || publishedVersions[pkg].length === 0) {
                console.log(`New package detected: ${pkg}`);
                return true;
            }
        });
    });
}
exports.getNewPackages = getNewPackages;
//# sourceMappingURL=getNewPackages.js.map