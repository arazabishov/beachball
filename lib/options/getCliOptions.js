"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const paths_1 = require("../paths");
const git_1 = require("../git");
// CLI Options cache
let cliOptions;
function getCliOptions() {
    if (cliOptions) {
        return cliOptions;
    }
    const argv = process.argv.splice(2);
    const args = yargs_parser_1.default(argv, {
        string: ['branch', 'tag', 'message', 'package', 'since'],
        array: ['scope'],
        boolean: ['git-tags', 'keep-change-files', 'no-bump'],
        alias: {
            branch: ['b'],
            tag: ['t'],
            registry: ['r'],
            message: ['m'],
            token: ['n'],
            help: ['h', '?'],
            yes: ['y'],
            package: ['p'],
            version: ['v'],
        },
    });
    const { _ } = args, restArgs = __rest(args, ["_"]);
    const cwd = paths_1.findGitRoot(process.cwd()) || process.cwd();
    cliOptions = Object.assign(Object.assign(Object.assign({}, (_.length > 0 && { command: _[0] })), restArgs), { path: cwd, fromRef: args.since, keepChangeFiles: args['keep-change-files'], bump: args.bump == null ? true : args.bump, branch: args.branch && args.branch.indexOf('/') > -1 ? args.branch : git_1.getDefaultRemoteBranch(args.branch, cwd) });
    return cliOptions;
}
exports.getCliOptions = getCliOptions;
//# sourceMappingURL=getCliOptions.js.map