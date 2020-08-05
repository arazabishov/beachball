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
const registry_1 = require("../fixtures/registry");
const npm_1 = require("../packageManager/npm");
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
const git_1 = require("../git");
const publish_1 = require("../commands/publish");
const repository_1 = require("../fixtures/repository");
describe('publish command (registry)', () => {
    let registry;
    let repositoryFactory;
    let spy;
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
        if (spy) {
            spy.mockRestore();
            spy = undefined;
        }
    }));
    it('will perform retries', () => __awaiter(void 0, void 0, void 0, function* () {
        registry.stop();
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
        spy = jest.spyOn(console, 'log').mockImplementation();
        const publishPromise = publish_1.publish({
            branch: 'origin/master',
            command: 'publish',
            message: 'apply package updates',
            path: repo.rootPath,
            publish: true,
            bumpDeps: false,
            push: false,
            registry: 'httppppp://somethingwrong',
            gitTags: false,
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
            timeout: 100,
        });
        yield expect(publishPromise).rejects.toThrow();
        expect(spy).toHaveBeenCalledWith('\nRetrying... (3/3)');
        spy.mockRestore();
        yield registry.start();
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
            bumpDeps: false,
            push: false,
            registry: registry.getUrl(),
            gitTags: false,
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
        });
        const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foo', '--json']);
        expect(showResult.success).toBeTruthy();
        const show = JSON.parse(showResult.stdout);
        expect(show.name).toEqual('foo');
        expect(show.versions.length).toEqual(1);
    }));
    it('can perform a successful npm publish even with private packages', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/foopkg/package.json', JSON.stringify({
            name: 'foopkg',
            version: '1.0.0',
            private: true,
        }));
        yield repo.commitChange('packages/publicpkg/package.json', JSON.stringify({
            name: 'publicpkg',
            version: '1.0.0',
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            foopkg: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foopkg',
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
            bumpDeps: false,
            push: false,
            registry: registry.getUrl(),
            gitTags: false,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: 'foopkg',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        });
        const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foopkg', '--json']);
        expect(showResult.success).toBeFalsy();
    }));
    it('can perform a successful npm publish when multiple packages changed at same time', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/foopkg/package.json', JSON.stringify({
            name: 'foopkg',
            version: '1.0.0',
            dependencies: {
                barpkg: '^1.0.0',
            },
        }));
        yield repo.commitChange('packages/barpkg/package.json', JSON.stringify({
            name: 'barpkg',
            version: '1.0.0',
        }));
        writeChangeFiles_1.writeChangeFiles({
            foopkg: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foopkg',
                dependentChangeType: 'patch',
            },
            barpkg: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'barpkg',
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
            bumpDeps: false,
            push: false,
            registry: registry.getUrl(),
            gitTags: false,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: 'foopkg',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        });
        const showResultFoo = npm_1.npm(['--registry', registry.getUrl(), 'show', 'foopkg', '--json']);
        expect(showResultFoo.success).toBeTruthy();
        const showFoo = JSON.parse(showResultFoo.stdout);
        expect(showFoo['dist-tags'].latest).toEqual('1.1.0');
        const showResultBar = npm_1.npm(['--registry', registry.getUrl(), 'show', 'barpkg', '--json']);
        expect(showResultBar.success).toBeTruthy();
        const showBar = JSON.parse(showResultFoo.stdout);
        expect(showBar['dist-tags'].latest).toEqual('1.1.0');
    }));
    it('can perform a successful npm publish even with a non-existent package listed in the change file', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/foopkg/package.json', JSON.stringify({
            name: 'foopkg',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/publicpkg/package.json', JSON.stringify({
            name: 'publicpkg',
            version: '1.0.0',
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            badname: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'badname',
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
            bumpDeps: false,
            push: false,
            registry: registry.getUrl(),
            gitTags: false,
            tag: 'latest',
            token: '',
            yes: true,
            new: false,
            access: 'public',
            package: 'foopkg',
            changehint: 'Run "beachball change" to create a change file',
            type: null,
            fetch: true,
            disallowedChangeTypes: null,
            defaultNpmTag: 'latest',
            retries: 3,
        });
        const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', 'badname', '--json']);
        expect(showResult.success).toBeFalsy();
    }));
});
//# sourceMappingURL=publishRegistry.test.js.map