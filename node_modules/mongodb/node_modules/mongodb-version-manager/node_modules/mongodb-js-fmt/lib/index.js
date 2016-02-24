var fs = require('fs');
var glob = require('glob');
var jsfmt = require('jsfmt');
var async = require('async');
var defaults = require('lodash.defaults');
var unique = require('lodash.uniq');
var debug = require('debug')('mongodb-js-fmt');
var chalk = require('chalk');
var figures = require('figures');

/**
 * Expand globs into paths.
 */
function resolve(opts, done) {
  debug('resolving paths for globs:\n', JSON.stringify(opts.globs));
  var tasks = opts.globs.map(function(pattern) {
    return function(cb) {
      debug('resolving `%s`...', pattern);
      glob(pattern, {}, function(err, files) {
        if (err) {
          return cb(err);
        }
        debug('resolved %d file(s) for `%s`', files.length, pattern);
        if (files.length > 0) {
          opts.files.push.apply(opts.files, files);
        }
        cb();
      });
    };
  });
  async.parallel(tasks, function(err) {
    if (err) {
      return done(err);
    }
    debug('checking and removing duplicate paths...');
    opts.files = unique(opts.files);
    debug('final result has `%d` files', opts.files.length);
    done(null, opts.files);
  });
}

function formatOne(opts, src, done) {
  debug('formatting `%s`...', src);
  fs.readFile(src, function(err, buf) {
    if (err) {
      return done(err);
    }

    var original = buf.toString('utf-8');
    try {
      var formatted = jsfmt.format(original, opts.jsfmtConfig);
      if (formatted === original) {
        debug('no formatting needed for `%s`', src);
        opts.unchanged.push(src);
        done();
      } else if (opts.dry === true) {
        // @todo (imlucas): Find module that computes diff and console.log(diff)
        debug('needs formatting but `--dry` specified `%s`...', src);
        opts.formatted.push(src);
        done();
      } else {
        debug('writing formatted version of `%s`...', src);
        opts.formatted.push(src);
        fs.writeFile(src, formatted, done);
      }
    } catch (e) {
      debug('error while formatting `%s`: %s', src, err);
      return done(e);
    }
  });
}

function format(opts, done) {
  debug('`%d` files will be formatted...', opts.files.length);
  async.parallel(opts.files.map(function(src) {
    return formatOne.bind(null, opts, src);
  }), done);
}

/**
 * @param {Object} opts
 * @param {Function} done
 * @api public
 */
module.exports = function(opts, done) {
  defaults(opts, {
    dir: process.cwd(),
    files: [],
    dry: false,
    json: false,
    formatted: [],
    unchanged: []
  });

  if (opts.globs.length === 0) {
    // @todo (imlucas): yeah, I can never remember how
    // to properly exclude node_modules either...
    opts.globs = [
      './bin/*.js',
      './lib/{**/*,*}.js',
      './examples/{**/*,*}.js',
      './src/{**/*,*}.js',
      './test/{**/*,*}.js',
      './*.js'
    ];
  }

  if (!Array.isArray(opts.globs)) {
    opts.globs = [opts.globs];
  }

  // @todo (imlucas): Support config via package.json.
  // var path = require('path');
  // var pkg = require(path.join(opts.dir, 'package.json'));
  // debug('Loaded package.json from `%s`', opts.dir);

  opts.jsfmtConfig = jsfmt.getConfig();
  debug('loaded jshint config');

  console.log(chalk.gray(figures.pointerSmall,
    'Applying shared JavaScript guidelines to your code...'));
  console.log(chalk.gray('  Use the'),
    chalk.gray.bold('--debug'),
    chalk.gray('flag for diagnostic info')
  );

  async.series([resolve.bind(null, opts), format.bind(null, opts)], function(err) {
    if (err) {
      return done(err);
    }
    delete opts.jsfmtConfig;
    debug('fmt complete: %j', opts);
    done(null, opts);
  });
};
