# mongodb-js-fmt [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

> Automatically rewrites [our code][mongodb-js] to [a shared spec][styleguide] because style is for tailors.

## Usage

```bash
npm install --save-dev mongodb-js-fmt
```

Add a new `fmt` script to your `package.json`:

```json
{
  "name": "<your-module-name>",
  "scripts": {
    "fmt": "mongodb-js-fmt ./*.js lib/{**/*.js,*.js}"
  }
}
```

Now run it to have your files rewritten:

```bash
npm run fmt
```

## How It Works

`mongodb-js-fmt` is merely a thin wrapper around a code
rewriter and canonical configuration file that defines the
rules the rewriter should apply so all of our
[code looks the same][styleguide] and we never have to
waste time on style in code reviews or arguing about
which rewriter tool is best.

Currently, we use [`jsfmt` from the Rdio team][jsfmt]
as the rewriter.  It's been an essential part of our daily
workflow since mid-2014 and literally saves us each hours
of work per month.

> @todo: why does this module exist?  package everything
> up in one box, strict control of upstreams, swap out
> the rewriter seamlessly when something better comes along
> e.g. want to ditch jsfmt for `eslint --autofix` +
> fb's amazing http://npm.im/jscodeshift

## Todo

```
--dry          Display diffs instead of rewriting files  [Default: `false`].
--changed      Populate `<file>...` based on local changes via `git status` [Default: `false`].
```

### `--changed`

Use [`git ls-files`](http://git-scm.com/docs/git-ls-files) to populate `opts.files`

### `--dry`

Display diffs only and don't overwrite files.

## Atom Package

Just need to publish to apm? Just want one source of truth and to be able
to delete the 100's of duplicate `.jsfmtrc` files across our projects.

### [esformatter-collapse-objects](https://github.com/wbinnssmith/esformatter-collapse-objects)

It's really nice, but needs a little time to tweak configs a
bit to aggree w/ eslint rules.  This allows for:


```javascript
var res = {formatted: [], unchanged: []};
```

instead of always forcing:

```javascript
var res = {
  formatted: [],
  unchanged: []
};
```

## License

Apache 2

[travis_img]: https://img.shields.io/travis/mongodb-js/fmt.svg
[travis_url]: https://travis-ci.org/mongodb-js/fmt
[npm_img]: https://img.shields.io/npm/v/mongodb-js-fmt.svg
[npm_url]: https://npmjs.org/package/mongodb-js-fmt
[mongodb-js]: http://mongodb-js.github.io/
[jsfmt]: https://github.com/rdio/jsfmt
[eslint]: http://eslint.org
[eslint-config-mongodb-js]: https://github.com/mongodb-js/eslint-config
[gofmt]: https://golang.org/cmd/gofmt/
[styleguide]: https://github.com/mongodb-js/javascript
