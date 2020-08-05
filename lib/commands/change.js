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
const promptForChange_1 = require("../changefile/promptForChange");
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
function change(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const changes = yield promptForChange_1.promptForChange(options);
        if (changes) {
            writeChangeFiles_1.writeChangeFiles(changes, options.path);
        }
    });
}
exports.change = change;
//# sourceMappingURL=change.js.map