# vscc
C/C++ Build &amp; Run task runner for VS Code.

Visual Studio Code does not have the "Build & Run" function, like Code::Blocks, to compile and execute C/C++ programs. This script uses GCC compiler and cb_console_runner from Code::Blocks to automatically compile and open compiled programs in console window.

### Installation
> 1) Set compilerPath in C/C++ Configuration (c_cpp_properties.json).
> 2) Download and copy "vscc" folder to workspace folder.
> 3) Create default build task (command is shown below).
> 4) Set consolePath. Leave empty if you want to open compiled programs in VS Code terminal.

### Build task command
    $ node vscc/build.js c++ ${fileBasenameNoExtension} ${fileExtname} ${fileDirname} [consolePath]
