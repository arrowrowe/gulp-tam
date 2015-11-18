# GulpTam

[![npm-version][npm-badge]][npm-url]

[npm-badge]: https://img.shields.io/npm/v/gulp-tam.svg
[npm-url]: https://www.npmjs.com/package/gulp-tam

> Gulp integration for [Tam][tam-url].

[tam-url]: https://github.com/arrowrowe/tam

# Install

```sh
npm i --save-dev gulp-tam
```

Note that you still need to install [Tam][1].

# Usage

```javascript
var gulp = require('gulp');
var tam = require('tam');
var gulpTam = require('gulp-tam')(gulp, tam)('./assets.json');

gulp.task('clean', gulpTam.clean);  // Remove the dist directory
gulp.task('build', gulpTam.build);  // Generate dist and the linked list
gulp.task('watch', gulpTam.watch);  // Watch the src directory and the assets

// You can have two gulpTam for frontstage and backstage!
var GulpTam = require('gulp-tam')(gulp, tam);
var gulpTamFrontStage = GulpTam('./assets-frontstage.json');
var gulpTamBackStage = GulpTam('./assets-backstage.json');
```
