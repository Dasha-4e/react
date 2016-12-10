/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var grunt = require('grunt');
var rollupBabel = require('rollup-plugin-babel');
var rollupReplace = require('rollup-plugin-replace');
var rollupResolve = require('rollup-plugin-node-resolve');
var UglifyJS = require('uglify-js');

var babelEs6ModulifyTransform = require('../../scripts/babel/transform-es6-modulify');

var LICENSE_TEMPLATE =
  grunt.file.read('./grunt/data/header-template-extended.txt');

function minify(src) {
  return UglifyJS.minify(src, {fromString: true}).code;
}

function bannerify(src) {
  var version = grunt.config.data.pkg.version;
  var packageName = this.data.packageName || this.data.moduleName;
  return (
    grunt.template.process(
      LICENSE_TEMPLATE,
      {data: {package: packageName, version: version}}
    ) +
    src
  );
}

function getPlugins(replaceConfig) {
  return [
    rollupBabel({
      babelrc: false,
      plugins: [babelEs6ModulifyTransform],
    }),
    rollupReplace(replaceConfig),
    rollupResolve({
      main: true,
    }),
  ];
}

var buildConfigs = {
  domFiber: {
    after: [bannerify],
    dest: 'build/rollup-react-dom-fiber.js',
    entry: './build/node_modules/react-dom/lib/ReactDOMFiber.js',
    format: 'umd',
    moduleName: 'ReactDOM',
    plugins: getPlugins({'process.env.NODE_ENV': JSON.stringify('development')}),
  },
  domFiberMin: {
    after: [minify, bannerify],
    dest: 'build/rollup-react-dom-fiber.min.js',
    entry: './build/node_modules/react-dom/lib/ReactDOMFiber.js',
    format: 'umd',
    moduleName: 'ReactDOM',
    plugins: getPlugins({'process.env.NODE_ENV': JSON.stringify('production')}),
  },
};

module.exports = buildConfigs;