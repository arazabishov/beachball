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
const repository_1 = require("../fixtures/repository");
const bumpAndPush_1 = require("../publish/bumpAndPush");
const publish_1 = require("../commands/publish");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
const git_1 = require("../git");
const gatherBumpInfo_1 = require("../bump/gatherBumpInfo");
describe('publish command (git)', () => {
    let repositoryFactory;
    beforeAll(() => {
        jest.setTimeout(30000);
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield repositoryFactory.cleanUp();
    }));
    it('can perform a successful git push', () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = yield repositoryFactory.cloneRepository();
        writeChangeFiles_1.writeChangeFiles({
            foo: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foo',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield publish_1.publish({
            branch: 'origin/master',
            command: 'publish',
            message: 'apply package updates',
            path: repo.rootPath,
            publish: false,
            bumpDeps: false,
            push: true,
            registry: 'http://localhost:99999/',
            gitTags: true,
            tag: 'latest',
            token: '',
            new: false,
            yes: true,
            access: 'public',
            package: 'foo',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        });
        const newRepo = yield repositoryFactory.cloneRepository();
        const packageJson = fs_extra_1.default.readJSONSync(path_1.default.join(newRepo.rootPath, 'package.json'));
        expect(packageJson.version).toBe('1.1.0');
    }));
    it('can handle a merge when there are change files present', () => __awaiter(void 0, void 0, void 0, function* () {
        // 1. clone a new repo1, write a change file in repo1
        const repo1 = yield repositoryFactory.cloneRepository();
        writeChangeFiles_1.writeChangeFiles({
            foo: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foo',
                dependentChangeType: 'patch',
            },
        }, repo1.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo1.rootPath });
        // 2. simulate the start of a publish from repo1
        const publishBranch = 'publish_test';
        git_1.gitFailFast(['checkout', '-b', publishBranch], { cwd: repo1.rootPath });
        console.log('Bumping version for npm publish');
        const options = {
            branch: 'origin/master',
            command: 'publish',
            message: 'apply package updates',
            path: repo1.rootPath,
            publish: false,
            bumpDeps: false,
            push: true,
            registry: 'http://localhost:99999/',
            gitTags: true,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: 'foo',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        };
        const bumpInfo = gatherBumpInfo_1.gatherBumpInfo(options);
        // 3. Meanwhile, in repo2, also create a new change file
        const repo2 = yield repositoryFactory.cloneRepository();
        writeChangeFiles_1.writeChangeFiles({
            foo2: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foo2',
                dependentChangeType: 'patch',
            },
        }, repo2.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo2.rootPath });
        // 4. Pretend to continue on with repo1's publish
        yield bumpAndPush_1.bumpAndPush(bumpInfo, publishBranch, options);
        // 5. In a brand new cloned repo, make assertions
        const newRepo = yield repositoryFactory.cloneRepository();
        const newChangePath = path_1.default.join(newRepo.rootPath, 'change');
        expect(fs_extra_1.default.existsSync(newChangePath)).toBeTruthy();
        const changeFiles = fs_extra_1.default.readdirSync(newChangePath);
        expect(changeFiles.length).toBe(1);
        const changeFileContent = fs_extra_1.default.readJSONSync(path_1.default.join(newChangePath, changeFiles[0]));
        expect(changeFileContent.packageName).toBe('foo2');
    }));
});
//# sourceMappingURL=publishGit.test.js.map