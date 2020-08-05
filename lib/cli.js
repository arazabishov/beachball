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
const bump_1 = require("./commands/bump");
const change_1 = require("./commands/change");
const publish_1 = require("./commands/publish");
const sync_1 = require("./commands/sync");
const help_1 = require("./help");
const getOptions_1 = require("./options/getOptions");
const validate_1 = require("./validation/validate");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const options = getOptions_1.getOptions();
    if (options.help) {
        help_1.showHelp();
        process.exit(0);
    }
    if (options.version) {
        help_1.showVersion();
        process.exit(0);
    }
    // Run the commands
    switch (options.command) {
        case 'check':
            validate_1.validate(options);
            console.log('No change files are needed');
            break;
        case 'publish':
            validate_1.validate(options);
            // set a default publish message
            options.message = options.message || 'applying package updates';
            yield publish_1.publish(options);
            break;
        case 'bump':
            validate_1.validate(options);
            yield bump_1.bump(options);
            break;
        case 'sync':
            sync_1.sync(options);
            break;
        default:
            const { isChangeNeeded } = validate_1.validate(options, { allowMissingChangeFiles: true });
            if (!isChangeNeeded && !options.package) {
                console.log('No change files are needed');
                return;
            }
            change_1.change(options);
            break;
    }
}))().catch(e => {
    help_1.showVersion();
    console.error('An error has been detected while running beachball!');
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map