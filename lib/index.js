
var basename = require('path').basename;
var debug = require('debug')('metalsmith-multimarkdown');
var dirname = require('path').dirname;
var extname = require('path').extname;
var mmd = require('mmd');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  options = options || {};
  var keys = options.keys || [];

  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!markdown(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);
      var str = mmd.convert(data.contents.toString(), options);
      data.contents = new Buffer(str);
      keys.forEach(function(key) {
        data[key] = mmd.convert(data[key], options);
      });

      delete files[file];
      files[html] = data;
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}