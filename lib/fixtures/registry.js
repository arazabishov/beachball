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
const child_process_1 = require("child_process");
// @ts-ignore
const find_free_port_1 = __importDefault(require("find-free-port"));
const verdaccioApi = require.resolve('./verdaccio.js');
const defaultPort = 4873;
// NOTE: If you are getting timeouts and port collisions, set jest.setTimeout to a higher value.
//       The default value of 5 seconds may not be enough in situations with port collisions.
//       A value scaled with the number of test modules using Registry should work, starting with 20 seconds or so.
class Registry {
    constructor() {
        // The biggest issue here is with tests launching in parallel creating registries, finding free ports,
        // and racing to grab ports they see as free. This means some tests will always fail on grabbing ports.
        // This class will attempt to find a free port, and once it does, continue using it, even through stops
        // and restarts. There's a theoretical chance of something grabbing the port between stops and restarts,
        // but probably not a practical concern.
        this.server = undefined;
        this.port = undefined;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server) {
                throw new Error('Server already started');
            }
            if (this.port) {
                // We've already successfully used this port, so we assume it will work again. (see comments above)
                return this.startWithPort(this.port);
            }
            let tryPort = defaultPort;
            while (!this.port) {
                // find-free-port will throw an error for us if none are free. No need to explicitly check.
                tryPort = yield find_free_port_1.default(tryPort, defaultPort + 10);
                try {
                    yield this.startWithPort(tryPort);
                    this.port = tryPort;
                }
                catch (_a) {
                    tryPort++;
                    console.log(`Could not start server, trying again on port ${tryPort}`);
                }
            }
        });
    }
    startWithPort(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.server = child_process_1.spawn(process.execPath, [verdaccioApi, port.toString()]);
                this.server.stdout.on('data', data => {
                    if (data.includes('verdaccio running')) {
                        resolve();
                    }
                });
                this.server.stderr.on('data', data => {
                    reject();
                });
                this.server.on('error', data => {
                    reject();
                });
            });
        });
    }
    stop() {
        if (this.server) {
            this.server.kill();
            this.server = undefined;
        }
    }
    /**
     * Reset the state of the registry to an empty registry. Starts server if not already started.
     */
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            // Since we're running in memory we can just restart the server.
            this.stop();
            yield this.start();
        });
    }
    /**
     * A helper to get registry URL based on currently used port.
     */
    getUrl() {
        if (!this.port) {
            throw new Error(`Can't getRegistryUrl, no valid port assigned.`);
        }
        return `http://localhost:${this.port}`;
    }
}
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map