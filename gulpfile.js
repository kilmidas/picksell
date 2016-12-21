var gulp = require('gulp'),
    // load Node.js API
    fs   = require('fs'),
    path = require('path'),
    // util
    gutil = require('gulp-util'),
    // sprite
    spritesmith = require('gulp.spritesmith'),
    // css
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    csssort = require('gulp-nts-css-formatter'),
    // postcss
    postcss     = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    // bs
    browserSync = require('browser-sync'),
    reload  = browserSync.reload;

// ---------------------------------
// directory
// ---------------------------------
var dir  = {
    /**
     * pc : sprite.support_1x.mustache
     * mobile : sprite.support_2x.mustache
     * **/
    template : 'sprite.support_2x.mustache',
    source: 'src/',
    scss:   'scss/lib/spritesmith/',
    img:    'img/',
    sprite: 'sprite/'
};

// ---------------------------------
// PostCss options
// ---------------------------------
var processors = [
    /**
     * ['last 2 versions', "Edge > 0", "ie >= 8"] : //PC옵션
     * ["Android > 0","iOS > 0","FirefoxAndroid > 0"] //모바일옵션
     * **/
    autoprefixer({browsers: ["Android > 0","iOS > 0","FirefoxAndroid > 0"]}),
    mqpacker
];

// ---------------------------------
// Functions
// ---------------------------------
// function.getFolders
var getFolders = function (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

// ---------------------------------
// Tasks
// ---------------------------------
// task.sprites
gulp.task('sprites', function () {
    // set target folders
    var folders = getFolders(dir.source + dir.img + dir.sprite);

    // generate image & sass files
    folders.map(function (folder) {

        var spriteData = gulp.src(dir.sprite + folder + '/*.png', {cwd: dir.source + dir.img})
            .pipe(spritesmith({
                imgPath:   '../' + dir.img + 'sp_' + folder + '.png',
                imgName:   'sp_' + folder + '.png',
                cssName:   '_sp_' + folder + '.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree', //top-down, left-right, diagonal, alt-diagonal, binary-tree
                padding:   10,
                cssTemplate: dir.source + dir.scss + dir.template,
                cssVarMap: function(sprite) {
                    sprite.name = sprite.name;
                    sprite.origin = 'sp_' + folder;
                },
                cssSpritesheetName: 'sp_' + folder
            }));

        spriteData.img.pipe(gulp.dest(dir.source + dir.img));
        spriteData.css.pipe(gulp.dest(dir.source + dir.scss));
    });
});

// ---------------------------------
// Tasks
// ---------------------------------
// task.sass
gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compact' // output style is [nested | expanded | compact | compressed]
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(postcss(processors))
        .pipe(csssort())
        .pipe(gulp.dest(dir.source + 'css'))
        .pipe(browserSync.stream());
});

// ---------------------------------
// Tasks
// ---------------------------------
// task.bs
gulp.task('bs', function() {
    browserSync({
        files : ['*.html','*.php'],
        startPath: 'src/',
        proxy: 'localhost:80',
        open: 'external',
        logPrefix: "bs"
    });

    gulp.watch(['src/scss/**/*.scss'], ['sass']);
    gulp.watch(['src/img/sprite/**/*'], ['sprites','sass']);
    gulp.watch(['src/lib/sprite/**/*'], ['sprites','sass']);
    gulp.watch(['src/**/*.html', 'src/**/*.php', 'src/js/*.js']).on('change', browserSync.reload);
});
