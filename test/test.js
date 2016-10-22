'use strict'

const test = require('ava')
const fp = require('./../index')
const path = require('path')
const assets = path.resolve(__dirname, 'assets')

// Main
test('fp returns empty array for file not found', (t) => {
  t.plan(1)
  return fp('you-wont-find-me.txt').then((data) => {
    t.truthy(Array.isArray(data) && data.length === 0)
  }).catch((e) => {
    throw e
  })
})

test('fp returns non-empty array for file found', (t) => {
  t.plan(1)
  return fp('find-me.txt', {hints: [assets]}).then((data) => {
    t.truthy(Array.isArray(data) && data.length > 0)
  }).catch((e) => {
    throw e
  })
})

test('fp returns non-empty array for file found, from array', (t) => {
  t.plan(1)
  let files = ['you-wont-find-me.txt', 'find-me.txt']
  return fp(files, {hints: [assets]}).then((data) => {
    t.truthy(Array.isArray(data) && data.length > 0)
  }).catch((e) => {
    throw e
  })
})
