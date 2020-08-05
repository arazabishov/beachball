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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("process"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs-extra"));
const exec_1 = require("./exec");
const tmpdir_1 = require("./tmpdir");
exports.packageJsonFixture = {
    name: 'foo',
    version: '1.0.0',
};
class RepositoryFactory {
    constructor() {
        /** Cloned child repos, tracked so we can clean them up */
        this.childRepos = [];
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const originalDirectory = process.cwd();
            this.root = yield tmpdir_1.tmpdir({ prefix: 'beachball-repository-upstream-' });
            process.chdir(this.root);
            yield exec_1.runCommands(['git init --bare']);
            const tmpRepo = new Repository();
            this.childRepos.push(tmpRepo);
            yield tmpRepo.initialize();
            yield tmpRepo.cloneFrom(this.root);
            yield tmpRepo.commitChange('README');
            yield fs.writeJSON(path_1.default.join(tmpRepo.rootPath, 'package.json'), exports.packageJsonFixture, { spaces: 2 });
            yield tmpRepo.commitChange('package.json');
            yield tmpRepo.push('origin', 'HEAD:master');
            process.chdir(originalDirectory);
        });
    }
    cloneRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must create before cloning');
            }
            const newRepo = new Repository();
            yield newRepo.initialize();
            yield newRepo.cloneFrom(this.root);
            return newRepo;
        });
    }
    cleanUp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must create before cleaning up');
            }
            yield fs.remove(this.root);
            for (const repo of this.childRepos) {
                yield repo.cleanUp();
            }
        });
    }
}
exports.RepositoryFactory = RepositoryFactory;
class Repository {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.root = yield tmpdir_1.tmpdir({ prefix: 'beachball-repository-cloned-' });
        });
    }
    get rootPath() {
        if (!this.root) {
            throw new Error('Must initialize before accessing path');
        }
        return this.root;
    }
    cloneFrom(path, originName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before cloning');
            }
            yield exec_1.runInDirectory(this.root, [
                `git clone ${originName ? '-o ' + originName + ' ' : ''}${path} .`,
                'git config user.email ci@example.com',
                'git config user.name CIUSER',
            ]);
            this.origin = path;
        });
    }
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitChange(newFilename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before cloning');
            }
            yield fs.ensureFile(path_1.default.join(this.root, newFilename));
            if (content) {
                yield fs.writeFile(path_1.default.join(this.root, newFilename), content);
            }
            yield exec_1.runInDirectory(this.root, [`git add ${newFilename}`, `git commit -m '${newFilename}'`]);
        });
    }
    getCurrentHash() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before getting head');
            }
            const result = yield exec_1.runInDirectory(this.root, ['git rev-parse HEAD']);
            return result[0].stdout.trim();
        });
    }
    branch(branchName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before cloning');
            }
            yield exec_1.runInDirectory(this.root, [`git checkout -b ${branchName}`]);
        });
    }
    push(remote, branch) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before push');
            }
            yield exec_1.runInDirectory(this.root, [`git push ${remote} ${branch}`]);
        });
    }
    cleanUp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before clean up');
            }
            yield fs.remove(this.root);
        });
    }
    /**
     * Set to invalid root
     */
    setRemoteUrl(remote, remoteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.root) {
                throw new Error('Must initialize before change remote url');
            }
            yield exec_1.runInDirectory(this.root, [`git remote set-url ${remote} ${remoteUrl}`]);
        });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map