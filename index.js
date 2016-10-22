'use strict'

// Setup
const execa = require('execa')
const path = require('path')
const defaultHintsForExt = {
  exe: [
    '%PROGRAMFILES%',
    '%PROGRAMFILES(x86)%',
    '%CommonProgramFiles%',
    '%COMMONPROGRAMFILES(x86)%',
    '%APPDATA%',
    '%LOCALAPPDATA%'
  ]
}
const defaultHints = ['%HOMEPATH%']
const getDrivesCmd = {
  shell: [
    'wmic',
    'logicaldisk',
    'get',
    'caption',
    '2>&1',
    '|',
    'findstr',
    '/V',
    '"Caption"'
  ]
}
const getFilesCmd = (files, paths) => {
  return {
    shell: [
      'DIR',
      `"${paths.join('" "')}"`,
      '/S',
      '/B',
      '2>&1',
      '|',
      'findstr',
      '/I',
      `"\\\\${files.join(' ')}"`
    ]
  }
}

// Exports
module.exports = filePaths

// Main
function filePaths (file, opts) {
  let files = (Array.isArray(file) ? file : [file]).map((f) => f.toLowerCase())
  opts = opts || {}
  if (opts.full) return getAllDrives().then((paths) => findFiles(files, paths))
  let exts = files.map((f) => path.extname(f).substr(1))
  exts = exts.filter((v, i, a) => a.indexOf(v) === i)
  let paths = opts.hints || (exts.length === 1
    ? (defaultHintsForExt[exts[0]] || defaultHints)
    : defaultHints
  )
  return findFiles(files, paths)
}

function getAllDrives () {
  let cmd = getDrivesCmd
  let drives = []
  return new Promise((resolve, reject) => {
    let shell = execa.shell(cmd.shell.join(' '))
    shell.catch((err) => reject(err))
    shell.stdout.on('data', (data) => {
      let drive = data.toString().trim().split(/\s+/g).filter((d) => d)
      drive = drive.map((d) => `${d}\\`)
      if (drive) drives = drives.concat(drive)
    }).on('end', () => {
      return resolve(drives)
    }).on('error', (err) => reject(err))
  })
}

function findFiles (fileList, pathList) {
  let cmd = getFilesCmd(fileList, pathList)
  let files = []
  return new Promise((resolve, reject) => {
    let shell = execa.shell(cmd.shell.join(' '))
    shell.catch((err) => reject(err))
    shell.stdout.on('data', (data) => {
      let file = data.toString().trim().split(/\r?\n|\r/g).filter((d) => d)
      file = file.filter((f) => {
        let fname = path.parse(f).base
        return fileList.indexOf(fname.toLowerCase()) !== -1
      })
      if (file) files = files.concat(file)
    }).on('end', () => {
      return resolve(files)
    }).on('error', (err) => reject(err))
  })
}
