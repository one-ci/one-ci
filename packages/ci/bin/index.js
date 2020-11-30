#!/usr/bin/env node
/*! @one-ci/ci 0.0.0 (e26e964) */
'use strict';

var program = require('commander');
var ci = require('miniprogram-ci');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var ora = require('ora');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var program__default = /*#__PURE__*/_interopDefaultLegacy(program);
var ci__default = /*#__PURE__*/_interopDefaultLegacy(ci);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);

var version = "0.0.0";

/**
 * 环境变量
 */
var Env;
(function (Env) {
    Env["Prod"] = "prod";
    Env["Dev"] = "dev";
})(Env || (Env = {}));
// dev -> do
// prod -> do

const env = process.env.RELEASE_ENV;
const envDescMap = {
    [Env.Prod]: '正式环境',
    [Env.Dev]: '测试环境',
};
const envFnMap = {
    [Env.Dev]: ci.preview,
    [Env.Prod]: ci.upload,
};
const version$1 = process.env.RELEASE_VERSION;
const desc = process.env.RELEASE_DESC;

const CWD = process.cwd();

function getEnv() {
    return {
        env,
        desc: desc + envDescMap[env],
        version: version$1 || getPackageVersion(),
    };
}
function getPackageVersion() {
    const filePath = path__default['default'].resolve(CWD, 'package.json');
    if (fs__default['default'].existsSync(filePath)) {
        try {
            return JSON.parse(fs__default['default'].readFileSync(filePath, {
                encoding: 'utf-8',
            })).version;
        }
        catch (error) { }
    }
}
function checkEnv() {
    const data = getEnv();
    const loading = ora__default['default']({
        text: chalk__default['default'].green('检查环境\n'),
        prefixText: chalk__default['default'].yellow('@one-ci/ci doctor'),
    });
    if (!data.env) {
        loading.fail(chalk__default['default'].red('检查环境失败') +
            chalk__default['default'].white(' 请传递环境变量 ') +
            chalk__default['default'].green(' RELEASE_ENV ') +
            chalk__default['default'].green(' eg export RELEASE_ENV=xxx '));
        return false;
    }
    else if (data.env === Env.Prod && !data.version) {
        loading.fail(chalk__default['default'].red('检查环境失败') +
            chalk__default['default'].white(' 请传递环境变量 ') +
            chalk__default['default'].green(' RELEASE_VERSION ') +
            chalk__default['default'].green(' eg export RELEASE_VERSION=xxx ') +
            chalk__default['default'].white(' 或者声明 package.json version 字段 '));
        return false;
    }
    loading.succeed('检查环境成功');
    return true;
}

const miniProgramConfigPath = path__default['default'].resolve(CWD, 'project.config.json');
// const packageConfigPath = path.resolve(CWD, 'package.json')

let userConfig = null;
function getMiniConfig(force = false) {
    if (force || userConfig === null) {
        const file = fs__default['default'].readFileSync(miniProgramConfigPath, {
            encoding: 'utf-8',
        });
        userConfig = JSON.parse(file);
        return userConfig;
    }
    return userConfig;
}
function checkMiniConfig() {
    const loading = ora__default['default']({
        text: chalk__default['default'].green('检查小程序配置\n'),
        prefixText: chalk__default['default'].yellow('@one-ci/ci doctor'),
    });
    const hasConfig = fs__default['default'].existsSync(miniProgramConfigPath);
    if (!hasConfig) {
        loading.fail(chalk__default['default'].red('检查小程序配置 失败 ') +
            chalk__default['default'].green.underline(miniProgramConfigPath) +
            chalk__default['default'].red(' 不存在 '));
        return false;
    }
    const config = getMiniConfig();
    if (config === null) {
        loading.fail(chalk__default['default'].red('检查小程序配置 失败') +
            chalk__default['default'].white(' 请检查') +
            chalk__default['default'].green(' 检查小程序配置文件 '));
        return false;
    }
    loading.succeed(chalk__default['default'].green('检查小程序配置 成功'));
    return true;
}
/**
 * postcss -> autoPrefixWXSS
 * uglifyFileName -> codeProtect
 * es6 -> es6
 * enhance -> es7
 * minified -> minify
 */
function transformSetting(settings = {}) {
    return {
        es6: settings.es6,
        es7: settings.enhance,
        minify: settings.minified,
        codeProtect: settings.uglifyFileName,
        autoPrefixWXSS: settings.postcss,
    };
}

const privateKeyName = '.__private.Key';
const privateKeyPath = path__default['default'].resolve(CWD, privateKeyName);

/**
 * 生成临时privateKey
 **/
function genPrivateKey() {
    if (process.env.PRIVATE_KEY) {
        try {
            fs__default['default'].writeFileSync(privateKeyPath, process.env.PRIVATE_KEY);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    else {
        return false;
    }
}
/**
 * 检查临时privateKey
 **/
function checkPrivateKey() {
    const loading = ora__default['default']({
        text: chalk__default['default'].green('生成临时privateKey\n'),
        prefixText: chalk__default['default'].yellow('@one-ci/ci doctor'),
    });
    const hasGenPrivateKey = genPrivateKey();
    if (!hasGenPrivateKey) {
        loading.fail(chalk__default['default'].red('生成临时privateKey 失败') +
            chalk__default['default'].white(' 请配置') +
            chalk__default['default'].green(' PRIVATE_KEY ') +
            chalk__default['default'].white('环境变量') +
            chalk__default['default'].green(' eg export PRIVATE_KEY= xxx '));
        return false;
    }
    loading.succeed(chalk__default['default'].green('生成临时privateKey 成功'));
    return true;
}

// 检查环境
function checkConfig() {
    for (const fn of [checkMiniConfig, checkEnv, checkPrivateKey]) {
        if (!fn()) {
            return false;
        }
    }
    return true;
}
function doctor() {
    if (!checkConfig()) {
        process.exit(1);
    }
}

async function deploy() {
    doctor();
    const miniConfig = getMiniConfig();
    const env = getEnv();
    const compileSettings = transformSetting(miniConfig.setting);
    const project = new ci__default['default'].Project({
        projectPath: CWD,
        privateKeyPath: privateKeyPath,
        appid: miniConfig.appid,
        type: 'miniProgram',
    });
    const fn = envFnMap[env.env];
    console.log(chalk__default['default'].green `开始发布`);
    try {
        const res = await fn({
            project,
            ...env,
            setting: compileSettings,
            qrcodeFormat: 'terminal',
            qrcodeOutputDest: '',
        });
        console.info(res);
        console.log(chalk__default['default'].green `发布成功`);
    }
    catch (error) {
        console.log(chalk__default['default'].red `发布失败`);
        console.error(error);
        process.exit(-1);
    }
}

program__default['default'].version(version).description('one ci for one');
program__default['default'].command('deploy').description('发布小程序').action(deploy);
program__default['default'].command('doctor').description('检查项目配置').action(doctor);
program__default['default'].on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program__default['default'].args.join(' '));
    process.exit(1);
});
program__default['default'].on('option:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program__default['default'].args.join(' '));
    process.exit(1);
});
program__default['default'].parse(process.argv);
const NO_COMMAND_SPECIFIED = program__default['default'].args.length === 0;
if (NO_COMMAND_SPECIFIED) {
    program__default['default'].help();
}
//# sourceMappingURL=index.js.map
