"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Configuration = (function () {
    function Configuration() {
    }
    Configuration.prototype.initialize = function (config) {
        this.karma = config || {};
        this.karmaTypescriptConfig = config.karmaTypescriptConfig || {};
        this.configureBundler();
        this.configureCoverage();
        this.configureFramework();
        this.configurePreprocessor();
        this.configureReporter();
        this.configureKarmaCoverage();
        this.assertConfiguration();
    };
    Configuration.prototype.hasFramework = function (name) {
        return this.karma.frameworks.indexOf(name) !== -1;
    };
    Configuration.prototype.hasPreprocessor = function (name) {
        for (var preprocessor in this.karma.preprocessors) {
            if (this.karma.preprocessors[preprocessor] &&
                this.karma.preprocessors[preprocessor].indexOf(name) !== -1) {
                return true;
            }
        }
        return false;
    };
    Configuration.prototype.hasReporter = function (name) {
        return this.karma.reporters.indexOf(name) !== -1;
    };
    Configuration.prototype.configureBundler = function () {
        var defaultBundlerOptions = {
            acornOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            },
            addNodeGlobals: true,
            constants: {},
            entrypoints: /.*/,
            exclude: [],
            ignore: [],
            noParse: [],
            resolve: {
                alias: {},
                directories: ["node_modules"],
                extensions: [".js", ".json", ".ts", ".tsx"]
            },
            transforms: [],
            validateSyntax: true
        };
        this.bundlerOptions = lodash_1.merge(defaultBundlerOptions, this.karmaTypescriptConfig.bundlerOptions);
    };
    Configuration.prototype.configureCoverage = function () {
        var defaultCoverageOptions = {
            exclude: /\.(d|spec|test)\.ts$/i,
            instrumentation: true,
            threshold: {
                file: {
                    branches: 0,
                    excludes: [],
                    functions: 0,
                    lines: 0,
                    overrides: {},
                    statements: 0
                },
                global: {
                    branches: 0,
                    excludes: [],
                    functions: 0,
                    lines: 0,
                    statements: 0
                }
            }
        };
        this.hasCoverageThreshold = !!this.karmaTypescriptConfig.coverageOptions &&
            !!this.karmaTypescriptConfig.coverageOptions.threshold;
        this.coverageOptions = lodash_1.merge(defaultCoverageOptions, this.karmaTypescriptConfig.coverageOptions);
        this.assertCoverageExclude(this.coverageOptions.exclude);
    };
    Configuration.prototype.configureFramework = function () {
        this.compilerOptions = this.karmaTypescriptConfig.compilerOptions;
        this.defaultTsconfig = {
            compilerOptions: {
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                jsx: "react",
                module: "commonjs",
                sourceMap: true,
                target: "ES5"
            },
            exclude: ["node_modules"]
        };
        this.exclude = this.karmaTypescriptConfig.exclude;
        this.include = this.karmaTypescriptConfig.include;
        this.tsconfig = this.karmaTypescriptConfig.tsconfig;
    };
    Configuration.prototype.configurePreprocessor = function () {
        var transformPath = function (filepath) {
            return filepath.replace(/\.(ts|tsx)$/, ".js");
        };
        this.transformPath = this.karmaTypescriptConfig.transformPath || transformPath;
    };
    Configuration.prototype.configureReporter = function () {
        this.reports = this.karmaTypescriptConfig.reports || { html: "coverage" };
        this.remapOptions = this.karmaTypescriptConfig.remapOptions || {};
    };
    Configuration.prototype.configureKarmaCoverage = function () {
        var defaultCoverageReporter = {
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        };
        this.coverageReporter = lodash_1.merge(defaultCoverageReporter, this.karma.coverageReporter);
        if (Array.isArray(this.karma.reporters)) {
            this.reporters = this.karma.reporters.slice();
            if (this.karma.reporters.indexOf("coverage") === -1) {
                this.reporters.push("coverage");
            }
        }
        else {
            this.reporters = ["coverage"];
        }
    };
    Configuration.prototype.assertConfiguration = function () {
        if (!this.asserted) {
            this.asserted = true;
            this.assertFrameworkConfiguration();
            this.assertDeprecatedOptions();
        }
    };
    Configuration.prototype.assertFrameworkConfiguration = function () {
        if (this.hasPreprocessor("karma-typescript") &&
            (!this.karma.frameworks || this.karma.frameworks.indexOf("karma-typescript") === -1)) {
            throw new Error("Missing karma-typescript framework, please add" +
                "'frameworks: [\"karma-typescript\"]' to your Karma config");
        }
    };
    Configuration.prototype.assertDeprecatedOptions = function () {
        if (this.bundlerOptions.ignoredModuleNames) {
            throw new Error("The option 'karmaTypescriptConfig.bundlerOptions.ignoredModuleNames' has been " +
                "removed, please use 'karmaTypescriptConfig.bundlerOptions.exclude' instead");
        }
        if (this.karmaTypescriptConfig.excludeFromCoverage !== undefined) {
            throw new Error("The option 'karmaTypescriptConfig.excludeFromCoverage' has been " +
                "removed, please use 'karmaTypescriptConfig.coverageOptions.exclude' instead");
        }
        if (this.karmaTypescriptConfig.disableCodeCoverageInstrumentation !== undefined) {
            throw new Error("The option 'karmaTypescriptConfig.disableCodeCoverageInstrumentation' has been " +
                "removed, please use 'karmaTypescriptConfig.coverageOptions.instrumentation' instead");
        }
    };
    Configuration.prototype.assertCoverageExclude = function (regex) {
        var _this = this;
        if (regex instanceof RegExp || !regex) {
            return regex;
        }
        else if (Array.isArray(regex)) {
            regex.forEach(function (r) {
                if (!(r instanceof RegExp)) {
                    _this.throwCoverageExcludeError(r);
                }
            });
            return regex;
        }
        this.throwCoverageExcludeError(regex);
    };
    Configuration.prototype.throwCoverageExcludeError = function (regex) {
        throw new Error("karmaTypescriptConfig.coverageOptions.exclude " +
            "must be a single RegExp or an Array of RegExp, got [" + typeof regex + "]: " + regex);
    };
    return Configuration;
}());
exports.Configuration = Configuration;
