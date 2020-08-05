"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tmp = __importStar(require("tmp"));
exports.testTag = 'testbeachballtag';
const testPackage = {
    name: 'testbeachballpackage',
    version: '0.6.0',
};
// Create a test package.json in a temporary location for use in tests.
var tmpPackageFile = path_1.default.join(tmp.dirSync().name, 'package.json');
fs_extra_1.default.writeJSONSync(tmpPackageFile, testPackage, { spaces: 2 });
exports.testPackageInfo = {
    name: testPackage.name,
    packageJsonPath: tmpPackageFile,
    version: testPackage.version,
    private: false,
    options: {
        gitTags: true,
        defaultNpmTag: 'latest',
        disallowedChangeTypes: [],
    },
};
//# sourceMappingURL=package.js.map