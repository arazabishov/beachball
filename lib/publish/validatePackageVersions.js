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
const shouldPublishPackage_1 = require("./shouldPublishPackage");
/**
 * Validate a package being published is not already published.
 */
function validatePackageVersions(bumpInfo, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        let hasErrors = false;
        const packages = [...bumpInfo.modifiedPackages].filter(pkg => {
            const { publish, reasonToSkip } = shouldPublishPackage_1.shouldPublishPackage(bumpInfo, pkg);
            if (!publish) {
                console.log(`Skipping package version validation - ${reasonToSkip}`);
                return false;
            }
            return true;
        });
        const publishedVersions = yield listPackageVersions_1.listPackageVersions(packages, registry);
        for (const pkg of packages) {
            const packageInfo = bumpInfo.packageInfos[pkg];
            process.stdout.write(`Validating package version - ${packageInfo.name}@${packageInfo.version}`);
            if (publishedVersions[pkg].includes(packageInfo.version)) {
                console.error(`\nERROR: Attempting to bump to a version that already exists in the registry: ${packageInfo.name}@${packageInfo.version}`);
                hasErrors = true;
            }
            else {
                process.stdout.write(' OK!\n');
            }
        }
        return !hasErrors;
    });
}
exports.validatePackageVersions = validatePackageVersions;
//# sourceMappingURL=validatePackageVersions.js.map