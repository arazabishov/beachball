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
const child_process_1 = require("child_process");
function exec(command) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec(command, (error, stdout, stderr) => {
            const result = {
                stderr,
                stdout,
                error,
            };
            if (error) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.exec = exec;
function runCommands(commands) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (let i = 0; i < commands.length; i++) {
            try {
                results.push(yield exec(commands[i]));
            }
            catch (e) {
                console.error('runCommands failed:', e);
                throw e;
            }
        }
        return results;
    });
}
exports.runCommands = runCommands;
/**
 * @returns The results of the commands run
 */
function runInDirectory(targetDirectory, commands) {
    return __awaiter(this, void 0, void 0, function* () {
        const originalDirectory = process.cwd();
        process.chdir(targetDirectory);
        const results = yield runCommands(commands);
        process.chdir(originalDirectory);
        return results;
    });
}
exports.runInDirectory = runInDirectory;
//# sourceMappingURL=exec.js.map