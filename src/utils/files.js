import fs from 'fs';
import path from 'path';
import cryptContent from './crypto.js';
import { execSync, exec, spawn, execFileSync } from 'child_process';
import { app, remote } from 'electron';
const { aesEncrypt, aesDecrypt } = cryptContent;

const whoami = execSync(`whoami`).toString().trim();
const isWindows = process.platform === 'win32';

let prefix = remote ?
    remote.app.getPath('userData')
    : app.getPath('userData');
console.log('======', prefix)
const myHostPath = `${prefix}/MyHost`;
const configPath = `${myHostPath}/.myhost`;
const localPath = `${myHostPath}/local`;
const hostPath = isWindows ? 'C:/Windows/System32/drivers/etc/hosts' : `/etc/hosts`;

let hostFiles = [];
// 初始化文件
let initFile = function () {

    !fs.existsSync(myHostPath) && execSync(`mkdir '${myHostPath}'`);

    !fs.existsSync(configPath) && execSync(`touch '${configPath}'`);


    if (!fs.existsSync(localPath)) {
        execSync(`cp '${hostPath}' '${localPath}'`);
    }

    let hostFilesArr = execSync(`ls '${myHostPath}'`, 'utf8').toString().split('\n');
    console.log(hostFilesArr)
    hostFilesArr.forEach(function (item) {
        if (item) {
            let temp = { name: item, isNameEdit: false, isSelect: false };
            hostFiles.push(temp);
        }
    });
};

// 新建
let newFile = function (name) {
    fs.writeFileSync(`${myHostPath}/${name}`, '');
}
// 重命名
let renameFile = function (oldName, newName) {
    fs.renameSync(`${myHostPath}/${oldName}`, `${myHostPath}/${newName}`);
};

// 删除文件
let removeFile = function (name) {
    fs.unlinkSync(`${myHostPath}/${name}`);
};

// 读取文件
let readFile = function (name) {
    return fs.readFileSync(`${myHostPath}/${name}`, 'utf8');
}


// 写文件
let writeFile = function (name, content) {
    fs.writeFileSync(`${myHostPath}/${name}`, content, 'utf8');
}

// 读取配置文件
let readConfigFile = function (key) {
    let configString = fs.readFileSync(`${myHostPath}/.myhost`, 'utf8');
    let config = configString ? JSON.parse(configString) : {};
    if (key === 'password') {
        return config[key] ? aesDecrypt(config[key], 'my-host-pwd') : '';
    } else {
        return config[key] || '';
    }
}

// 写配置文件
let writeConfigFile = function (key, val) {
    let configString = fs.readFileSync(`${configPath}`, 'utf8');
    let config = configString ? JSON.parse(configString) : {};

    if (key === 'password') {
        config[key] = aesEncrypt(val, 'my-host-pwd')
    } else {
        config[key] = val;
    }
    fs.writeFileSync(`${configPath}`, JSON.stringify(config), 'utf8');
}

// 改变owner
let changeOwner = function (password, owner, cb) {
    exec(`echo ${password}|sudo -S chown ${owner} ${hostPath}`, cb)
};

// 写host: 改变使用文件，删除文件，获取（同步）远程，初始化时触发写入 host
let writeHost = function () {
    let passwordVal = readConfigFile('password');
    let useFiles = readConfigFile('use') || [];

    changeOwner(passwordVal, whoami, function (err, stdout, stderr) {
        if (err) {
            alert('电脑密码错误，请重新配置！')
        } else {
            fs.writeFileSync(hostPath, '', 'utf8');
            useFiles.forEach(function (file) {
                let name = file.name;
                let fileString = readFile(name);
                fs.appendFileSync(hostPath, `\n###################################################################`);
                fs.appendFileSync(hostPath, `\n####                      ${name} host 配置                      ####`);
                fs.appendFileSync(hostPath, `\n###################################################################\n`);
                fs.appendFileSync(hostPath, fileString, 'utf8');
                fs.appendFileSync(hostPath, `\n\n`);
            });
            // 重新改回 owner
            changeOwner(passwordVal, 'root', function () { });
        }
    });
};


// flush chrome
let flushChromeDNS = function () {
    exec(`
        #!/bin/bash
        osascript <<EOD
    tell application "Google Chrome"
        tell front window
            set origTab to active tab
            set origTabIndex to active tab index
            set theTab to make new tab with properties {URL:"chrome://net-internals/#dns"}
            set isLoadDone to not loading of theTab
            repeat until isLoadDone
                set isLoadDone to not loading of theTab
            end repeat
            delay 1
            execute theTab javascript "document.getElementById('dns-view-clear-cache').click();"
            close theTab
            set theTab to make tab with properties {URL:"chrome://net-internals/#sockets"}
            set isLoadDone to not loading of theTab
            repeat until isLoadDone
                set isLoadDone to not loading of theTab
            end repeat
            delay 1
            execute theTab javascript "document.getElementById('sockets-view-flush-button').click();"
            close theTab
            set active tab index to origTabIndex
            -- uncomment the line below (remove -- ) if you would like previously opened tab to be reloaded.
            -- reload origTab
        end tell
    end tell
EOD
    `, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        }
    });
};

let reconnectWifi = () => {
    // 断开网络
    exec(`ipconfig/release`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        }
    });
    // 重连  
    exec(`ipconfig/renew`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        }
    })
}

const content = {
    whoami,
    initFile,
    hostFiles,
    newFile,
    renameFile,
    removeFile,
    readFile,
    writeFile,
    writeHost,
    readConfigFile,
    writeConfigFile,
    changeOwner,
    isWindows,
    flushChromeDNS,
    reconnectWifi
};

export default content;