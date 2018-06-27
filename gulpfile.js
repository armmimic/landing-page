'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    connect = require('gulp-connect'),
    rimraf = require('rimraf');

var folders = {
    src: 'src/',
    dst: 'build/'
}

var config = {
    build: './build'
}

gulp.task('connect', function() {
    connect.server({
        root: ['build'],
        port: 4020,
        livereload: true
    });
});

var path = {
    build: {
        html: folders.dst,
        js: folders.dst + 'js/',
        css: folders.dst + 'css/',
        img: folders.dst + 'images/',
        fonts: folders.dst + 'fonts/'
    },
    src: {
        html: folders.src + '*.html',
        js: folders.src + 'js/app.js',
        style: folders.src + 'styles/app.scss',
        img: [
            folders.src + 'images/*.*'
        ],
        fonts: folders.src + 'fonts/**/*.*',
        favicons: folders.src + 'favicons/**/*.*'
    },
    watch: {
        html: folders.src + '**/*.html',
        js: folders.src + 'js/**/*.js',
        style: folders.src + 'styles/**/*.scss',
        img: [
            folders.src + 'images/*.*'
        ],
        fonts: folders.src + 'fonts/**/*.*'
    }
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(connect.reload())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('styles:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/styles/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('images:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('copy:favicons', function () {
    gulp.src(path.src.favicons)
        .pipe(gulp.dest(path.build.html));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'styles:build',
    'fonts:build',
    'images:build',
    'copy:favicons'
]);


gulp.task('watch', function () {
    gulp.watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    gulp.watch([path.watch.style], function (event, cb) {
        gulp.start('styles:build');
    });
    gulp.watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.img], function (event, cb) {
        gulp.start('images:build');
    });
    gulp.watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'watch', 'connect']);