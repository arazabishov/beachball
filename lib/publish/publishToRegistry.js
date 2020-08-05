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
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const performBump_1 = require("../bump/performBump");
const packagePublish_1 = require("../packageManager/packagePublish");
const validatePackageVersions_1 = require("./validatePackageVersions");
const displayManualRecovery_1 = require("./displayManualRecovery");
const toposortPackages_1 = require("./toposortPackages");
const shouldPublishPackage_1 = require("./shouldPublishPackage");
const validatePackageDependencies_1 = require("./validatePackageDependencies");
function publishToRegistry(originalBumpInfo, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { registry, tag, token, access, timeout, bump } = options;
        const bumpInfo = lodash_1.default.cloneDeep(originalBumpInfo);
        const { modifiedPackages, newPackages, packageInfos } = bumpInfo;
        if (bump) {
            yield performBump_1.performBump(bumpInfo, options);
        }
        const succeededPackages = new Set();
        let invalid = false;
        if (!(yield validatePackageVersions_1.validatePackageVersions(bumpInfo, registry))) {
            displayManualRecovery_1.displayManualRecovery(bumpInfo, succeededPackages);
            invalid = true;
        }
        else if (!validatePackageDependencies_1.validatePackageDependencies(bumpInfo)) {
            invalid = true;
        }
        if (invalid) {
            console.error('No packages have been published');
            process.exit(1);
        }
        // get the packages to publish, reducing the set by packages that don't need publishing
        const packagesToPublish = toposortPackages_1.toposortPackages([...modifiedPackages, ...newPackages], packageInfos).filter(pkg => {
            const { publish, reasonToSkip } = shouldPublishPackage_1.shouldPublishPackage(bumpInfo, pkg);
            if (!publish) {
                console.log(`Skipping publish - ${reasonToSkip}`);
            }
            return publish;
        });
        // if there is a prepublish hook perform a prepublish pass, calling the routine on each package
        const prepublishHook = (_a = options.hooks) === null || _a === void 0 ? void 0 : _a.prepublish;
        if (prepublishHook) {
            for (const pkg of packagesToPublish) {
                const packageInfo = bumpInfo.packageInfos[pkg];
                const maybeAwait = prepublishHook(path_1.default.dirname(packageInfo.packageJsonPath), packageInfo.name, packageInfo.version);
                if (maybeAwait instanceof Promise) {
                    yield maybeAwait;
                }
            }
        }
        // finally pass through doing the actual npm publish command
        for (const pkg of packagesToPublish) {
            const packageInfo = bumpInfo.packageInfos[pkg];
            console.log(`Publishing - ${packageInfo.name}@${packageInfo.version}`);
            let result;
            let retries = 0;
            do {
                result = packagePublish_1.packagePublish(packageInfo, registry, token, tag, access, timeout);
                if (result.success) {
                    console.log('Published!');
                    succeededPackages.add(pkg);
                    break;
                }
                else {
                    retries++;
                    console.log('Publish failed:');
                    console.log(result.stderr);
                    if (retries <= options.retries) {
                        console.log(`\nRetrying... (${retries}/${options.retries})`);
                    }
                }
            } while (retries <= options.retries);
            if (!result.success) {
                displayManualRecovery_1.displayManualRecovery(bumpInfo, succeededPackages);
                console.error(result.stderr);
                throw new Error('Error publishing, refer to the previous error messages for recovery instructions');
            }
        }
    });
}
exports.publishToRegistry = publishToRegistry;
//# sourceMappingURL=publishToRegistry.js.map