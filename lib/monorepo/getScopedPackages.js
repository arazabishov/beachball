"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageInfos_1 = require("./getPackageInfos");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function getScopedPackages(options) {
    const packageInfos = getPackageInfos_1.getPackageInfos(options.path);
    if (!options.scope) {
        return Object.keys(packageInfos);
    }
    let includeScopes = options.scope.filter(s => !s.startsWith('!'));
    includeScopes = includeScopes.length > 0 ? includeScopes : ['**/*', '', '*'];
    const excludeScopes = options.scope.filter(s => s.startsWith('!'));
    const scopedPackages = [];
    for (let [pkgName, info] of Object.entries(packageInfos)) {
        const relativePath = path_1.default.relative(options.path, path_1.default.dirname(info.packageJsonPath));
        const shouldInclude = utils_1.isPathIncluded(relativePath, includeScopes, excludeScopes);
        if (shouldInclude) {
            scopedPackages.push(pkgName);
        }
    }
    return scopedPackages;
}
exports.getScopedPackages = getScopedPackages;
//# sourceMappingURL=getScopedPackages.js.map