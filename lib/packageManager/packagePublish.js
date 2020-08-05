"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const npm_1 = require("./npm");
function packagePublish(packageInfo, registry, token, tag, access, timeout) {
    const packageOptions = packageInfo.options;
    const packagePath = path_1.default.dirname(packageInfo.packageJsonPath);
    const args = ['publish', '--registry', registry, '--tag', tag || packageOptions.defaultNpmTag, '--loglevel', 'warn'];
    if (token) {
        const shorthand = registry.substring(registry.indexOf('//'));
        args.push(`--${shorthand}:_authToken=${token}`);
    }
    if (access && packageInfo.name.startsWith('@')) {
        args.push('--access');
        args.push(access);
    }
    console.log(`publish command: ${args.join(' ')}`);
    return npm_1.npm(args, { cwd: packagePath, timeout });
}
exports.packagePublish = packagePublish;
//# sourceMappingURL=packagePublish.js.map