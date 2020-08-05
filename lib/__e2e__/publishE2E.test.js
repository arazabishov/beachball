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
const registry_1 = require("../fixtures/registry");
const npm_1 = require("../packageManager/npm");
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
const git_1 = require("../git");
const publish_1 = require("../commands/publish");
const repository_1 = require("../fixtures/repository");
const monorepo_1 = require("../fixtures/monorepo");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
describe('publish command (e2e)', () => {
    let registry;
    let repositoryFactory;
    beforeAll(() => {
        registry = new registry_1.Registry();
        jest.setTimeout(30000);
    });
    afterAll(() => {
        registry.stop();
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield registry.reset();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (repositoryFactory) {
            yield repositoryFactory.cleanUp();
            repositoryFactory = undefined;
        }
    }));
    it('can perform a successful npm publish', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
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
            publish: true,
            bumpDeps: true,
            push: true,
            registry: registry.getUrl(),
            gitTags: true,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: '',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        });
        const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foo', '--json']);
        expect(showResult.success).toBeTruthy();
        const show = JSON.parse(showResult.stdout);
        expect(show.name).toEqual('foo');
        expect(show.versions.length).toEqual(1);
        expect(show['dist-tags'].latest).toEqual('1.1.0');
        git_1.git(['checkout', 'master'], { cwd: repo.rootPath });
        git_1.git(['pull'], { cwd: repo.rootPath });
        const gitResults = git_1.git(['describe', '--abbrev=0'], { cwd: repo.rootPath });
        expect(gitResults.success).toBeTruthy();
        expect(gitResults.stdout).toBe('foo_v1.1.0');
    }));
    it('should not perform npm publish on out-of-scope package', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new monorepo_1.MonoRepoFactory();
        yield repositoryFactory.create();
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
        writeChangeFiles_1.writeChangeFiles({
            bar: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'bar',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield publish_1.publish({
            branch: 'origin/master',
            command: 'publish',
            message: 'apply package updates',
            path: repo.rootPath,
            publish: true,
            bumpDeps: true,
            push: true,
            registry: registry.getUrl(),
            gitTags: true,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: '',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            scope: ['!packages/foo'],
            retries: 3,
        });
        const fooNpmResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foo', '--json']);
        expect(fooNpmResult.success).toBeFalsy();
        const fooGitResults = git_1.git(['describe', '--abbrev=0'], { cwd: repo.rootPath });
        expect(fooGitResults.success).toBeFalsy();
        const barNpmResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'bar', '--json']);
        expect(barNpmResult.success).toBeTruthy();
        const show = JSON.parse(barNpmResult.stdout);
        expect(show.name).toEqual('bar');
        expect(show.versions.length).toEqual(1);
        expect(show['dist-tags'].latest).toEqual('1.4.0');
        git_1.git(['checkout', 'master'], { cwd: repo.rootPath });
        git_1.git(['pull'], { cwd: repo.rootPath });
        const barGitResults = git_1.git(['describe', '--abbrev=0', 'bar_v1.4.0'], { cwd: repo.rootPath });
        expect(barGitResults.success).toBeTruthy();
        expect(barGitResults.stdout).toBe('bar_v1.4.0');
    }));
    it('should respect prepublish hooks', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new monorepo_1.MonoRepoFactory();
        yield repositoryFactory.create();
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
            publish: true,
            bumpDeps: true,
            push: true,
            registry: registry.getUrl(),
            gitTags: true,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: '',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
            hooks: {
                prepublish: (packagePath) => {
                    const packageJsonPath = path_1.default.join(packagePath, 'package.json');
                    const packageJson = fs_extra_1.default.readJSONSync(packageJsonPath);
                    if (packageJson.onPublish) {
                        Object.assign(packageJson, packageJson.onPublish);
                        delete packageJson.onPublish;
                        fs_extra_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
                    }
                },
            },
        });
        // Query the information from package.json from the registry to see if it was successfully patched
        const fooNpmResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foo', '--json']);
        expect(fooNpmResult.success).toBeTruthy();
        const show = JSON.parse(fooNpmResult.stdout);
        expect(show.name).toEqual('foo');
        expect(show.main).toEqual('lib/index.js');
        expect(show.hasOwnProperty('onPublish')).toBeFalsy();
        git_1.git(['checkout', 'master'], { cwd: repo.rootPath });
        git_1.git(['pull'], { cwd: repo.rootPath });
        // All git results should still have previous information
        const fooGitResults = git_1.git(['describe', '--abbrev=0'], { cwd: repo.rootPath });
        expect(fooGitResults.success).toBeTruthy();
        const fooPackageJson = fs_extra_1.default.readJSONSync(path_1.default.join(repo.rootPath, 'packages/foo/package.json'));
        expect(fooPackageJson.main).toBe('src/index.ts');
        expect(fooPackageJson.onPublish.main).toBe('lib/index.js');
    }));
});
//# sourceMappingURL=publishE2E.test.js.map