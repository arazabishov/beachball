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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getScopedPackages_1 = require("../monorepo/getScopedPackages");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const listPackageVersions_1 = require("../packageManager/listPackageVersions");
const semver_1 = __importDefault(require("semver"));
const setDependentVersions_1 = require("../bump/setDependentVersions");
const performBump_1 = require("../bump/performBump");
function sync(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageInfos = getPackageInfos_1.getPackageInfos(options.path);
        const scopedPackages = new Set(getScopedPackages_1.getScopedPackages(options));
        const infos = new Map(Object.entries(packageInfos).filter(([pkg, info]) => !info.private && scopedPackages.has(pkg)));
        const publishedVersions = yield listPackageVersions_1.listPackageVersions([...infos.keys()], options.registry);
        const modifiedPackages = new Set();
        for (const [pkg, info] of infos.entries()) {
            if (publishedVersions[pkg]) {
                const publishedVersion = semver_1.default.sort(publishedVersions[pkg])[publishedVersions[pkg].length - 1];
                if (publishedVersion && semver_1.default.lt(info.version, publishedVersion)) {
                    console.log(`There is a newer version of "${pkg}@${info.version}". Syncing to the published version ${publishedVersion}`);
                    packageInfos[pkg].version = publishedVersion;
                    modifiedPackages.add(pkg);
                }
            }
        }
        const dependentModifiedPackages = setDependentVersions_1.setDependentVersions(packageInfos);
        dependentModifiedPackages.forEach(pkg => modifiedPackages.add(pkg));
        performBump_1.writePackageJson(modifiedPackages, packageInfos);
    });
}
exports.sync = sync;
//# sourceMappingURL=sync.js.map