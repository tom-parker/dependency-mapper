var apps = [
    'next-engels',
    'next-dobi',
    'next-letov',
    'next-ilyushin',
    'next-grumman',
    'next-errors'
];

require('es6-promise').polyfill();

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function bowerInstall(cwd) {
    return new Promise(function(resolve, reject) {
        exec('bower install', {cwd : cwd}, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function bowerList(cwd) {
    return new Promise(function(resolve, reject) {
        exec('bower list --json', {cwd : cwd, maxBuffer: 1024 * 500}, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    });
}

function parseVersions(obj) {
    var deps = obj;
    for (var key in deps) {
        if (deps[key].update) {
            console.log(key, deps[key].update.target);
        } else {
            console.log(key, deps[key].pkgMeta.version);
        }
        if (!isEmptyObject(deps[key].dependencies)) {
            //parseVersions(deps[key].dependencies);
        }
    }
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

apps.forEach(function(app) {
    var appPath = path.join(__dirname, '..', app);
    bowerInstall(appPath)
        .then(function() {
            return bowerList(appPath);
        })
        .then(function(data) {
            return JSON.parse(data);
        })
        .then(function(obj) {
            return parseVersions(obj.dependencies);
        })
        .catch(function(err) {
            console.log(err);
        });
});



