const properties = require('../.vscode/c_cpp_properties.json').configurations[0];
const promisify = require('util').promisify;
const execFile = promisify(require('child_process').execFile);
const exec = promisify(require('child_process').exec);
const os = require('os');

// Command line arguments and settings
const args = {
    language: process.argv[2],
    fileBasename: process.argv[3],
    fileExtname: process.argv[4],
    fileDirname: process.argv[5],
    consolePath: process.argv[6]
}
const color = {
    yellow: "\x1b[93m",
    red: "\x1b[91m",
    reset: "\x1b[0m"
}

// Check OS type to support Windows & Linux
const isWindows = (os.type() === "Windows_NT" ? true : false);
const slash = (isWindows ? "\\" : "/");

var compiler = {
    path: properties.compilerPath.replace(properties.compilerPath.split(slash).pop(), ""),
    arguments: [
        "-g",
        "-o",
        args.fileDirname + slash + args.fileBasename,
        args.fileDirname + slash + args.fileBasename + args.fileExtname
    ]
}

// Build function
const startCompiler = async function () {
    switch (args.language) {
        case 'c++':
            if (properties.cppStandard) {
                compiler.arguments.unshift("-std=" + properties.cppStandard);
            }
            return await execFile("g++", compiler.arguments, { cwd: compiler.path });
        case 'c':
            if (properties.cStandard) {
                compiler.arguments.unshift("-std=" + properties.cStandard);
            }
            return await execFile("gcc", compiler.arguments, { cwd: compiler.path });
    }
    return color.red + "Language " + args.language + " not found!" + color.reset;
}

// Start console runner
const runConsole = async function (path) {
    if (path) {
        // run console if its path is specified
        return await exec((isWindows ? "start " : "./") + path + " " + args.fileDirname + slash + args.fileBasename + (isWindows ? ".exe" : ""), { cwd: compiler.path });
    } else {
        // otherwise, run in terminal
        return await execFile(args.fileDirname + slash + args.fileBasename, { cwd: compiler.path });
    }
}

// Start compiled file
const startProgram = function () {
    runConsole(args.consolePath).then(function (val) {
        if (val.stdout) {
            console.log(val.stdout);
        }
        if (val.stderr) {
            console.log(color.yellow + "ERROR\n" + color.red + val.stderr + color.reset);
        }
    }).catch(function (error) {
        console.log(color.yellow + "FAILED TO OPEN CONSOLE\n" + color.red + (error.stderr ? error.stderr : error) + color.reset);
    });
}

// Run build task
console.log("Running build task for " + args.fileBasename + args.fileExtname + "\n");
if (properties.compilerPath) {
    startCompiler().then(function (val) {
        if (val.stdout) {
            console.log(val.stdout);
        }
        if (val.stderr) {
            console.log(color.yellow + "ERROR\n" + color.red + val.stderr + color.reset);
        } else {
            startProgram();
        }
    }).catch(function (error) {
        console.log(color.yellow + "COMPILATION ERROR\n" + color.red + (error.stderr ? error.stderr : error) + color.reset);
    });
} else {
    console.log(color.red + "No compiler found! Please set compilerPath in c_cpp_properties.json file." + color.reset);
}
