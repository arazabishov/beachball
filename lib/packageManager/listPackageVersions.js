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
const npm_1 = require("./npm");
const p_limit_1 = __importDefault(require("p-limit"));
const packageVersions = {};
const NPM_CONCURRENCY = 5;
function listIndividualPackageVersions(packageName, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!packageVersions[packageName]) {
            const showResult = yield npm_1.npmAsync(['show', '--registry', registry, '--json', packageName]);
            if (showResult.success) {
                const packageInfo = JSON.parse(showResult.stdout);
                packageVersions[packageName] = packageInfo.versions;
            }
            else {
                packageVersions[packageName] = [];
            }
        }
        return packageVersions[packageName];
    });
}
exports.listIndividualPackageVersions = listIndividualPackageVersions;
function listPackageVersions(packageList, registry) {
    return __awaiter(this, void 0, void 0, function* () {
        const limit = p_limit_1.default(NPM_CONCURRENCY);
        const all = [];
        const versions = {};
        for (const pkg of packageList) {
            all.push(limit(() => __awaiter(this, void 0, void 0, function* () {
                versions[pkg] = yield listIndividualPackageVersions(pkg, registry);
            })));
        }
        yield Promise.all(all);
        return versions;
    });
}
exports.listPackageVersions = listPackageVersions;
//# sourceMappingURL=listPackageVersions.js.map