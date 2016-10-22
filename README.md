# file-paths-win32 [![NPM version](https://badge.fury.io/js/file-path-win32.svg)](https://npmjs.org/package/file-paths-win32)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Find paths of files matching file name on Windows

## install

```sh
$ npm install --save file-paths-win32
```

## api

### returns
Promise is returned with
- **resolve** *(array) [Array of file paths, empty if not found]*
- **reject** *(error)*

### arguments
- **filename(s)** *(string || array)*
- **opts** *(object) optional*
  - **hints** *(array - %HOMEPATH% unless file is EXE) [paths to search]*
  - **full** *(boolean - false) [search all drives recursively]*

## usage

```js
const filePaths = require('file-paths-win32')
let fpOpts

// search for single file in default paths
filePaths('someFile.txt').then(console.log).catch(console.error)

// search for single EXE in default executable paths
filePaths('someApp.exe').then(console.log).catch(console.error)

// search for array of files in default paths
filePaths(['someFile.txt', 'someApp.exe']).then(console.log).catch(console.error)

// search for single file in specific paths
fpOpts = {hints: ['C:\\some\\path', 'C:\\some\\other\\path\\']}
filePaths('someFile', fpOpts).then(console.log).catch(console.error)

// search for single file in all drives recursively
fpOpts = {full: true}
filePaths('someFile', fpOpts).then(console.log).catch(console.error)
```

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
