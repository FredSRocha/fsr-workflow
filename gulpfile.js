// Initialize all variables. (Alphabetical Order)
var app, autoprefixer, base, browserSync, cleanCSS, coffee, concat, connectLogger, del, directory, ftp, gulp, gulpif, gulpSequence, gutil, historyApiFallback, hostname, imagemin, path, plumber, pug, refresh, sass, shell, sourceMaps, uglify;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

// Load all dependencies.
autoprefixer       = require('gulp-autoprefixer');
browserSync        = require('browser-sync');
cleanCSS           = require('gulp-clean-css');
coffee             = require('gulp-coffee');
concat             = require('gulp-concat');
connectLogger      = require('connect-logger');
ftp                = require('vinyl-ftp');
gulp               = require('gulp');
gulpif             = require('gulp-if')
gulpSequence       = require('gulp-sequence').use(gulp);
gutil              = require('gulp-util');
historyApiFallback = require('connect-history-api-fallback');
imagemin           = require('gulp-imagemin');
plumber            = require('gulp-plumber');
pug                = require('gulp-pug');
sass               = require('gulp-sass');
shell              = require('gulp-shell');
sourceMaps         = require('gulp-sourcemaps');
uglify             = require('gulp-uglify');

/* 
 * ### Front Server Rest Workflow Fullstack ###
 * 
 * @considerations use:
 * 
 * The coffee()  | Compiles .coffee files.
 * The sass()    | Compiles .scss files.
 * The pug()     | Compiles .pug files. 
 * The plumber() | Prevent pipe breaking caused by errors from gulp plugins.
 * The concat()  | Files will be concatenated in the order that they are specified in the gulp.src().
 * The uglify()  | Compress files.
 * The .on()     | Get error logs.
 * The dest()    | Destination of files.
 * The sourceMaps() | Creating refrence sourcemap.
 * The browserSync.reload() | Notify browserSync to refresh.
 * 
 */

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "app/",
            // Very important if you want to use: $locationProvider.html5Mode(); and want to follow track logs on the server.
            middleware: [require("connect-logger")(), historyApiFallback()]
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

/* 
 * @considerations of develop tasks:
 * 
 * (scripts)   | Compiling .coffee files. (First import libraries, /_coffee files and after /_coffee/subfolder files)
 * (styles)    | Compiling .scss files and generate sourcemap.
 * (templates) | Compiling .pug files.
 * (images)    | Compressing images .jpg and .png files.
 * (default)   | Run default task. (Start up the web server, browserSync, observes the files waiting for changes, compile and compress all files)
 * 
 */

gulp.task('scripts', function() {
  return gulp.src(['app/libs/**/*.min.js', 'app/scripts/_coffee/**/*.coffee'])
             .pipe(plumber())
             .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
             .pipe(concat('app.js'))
             .on('error', gutil.log)
             .pipe(gulp.dest('app/scripts'))
             .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', function() {
    return gulp.src('app/styles/_scss/main.scss')
               .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
               }))
               .pipe(sourceMaps.init())
               .pipe(sass({
                    errLogToConsole: true,
                    includePaths: [
                        'app/styles/_scss'
                    ]
               }))
               .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
               }))
               .on('error', gutil.log)
               .pipe(concat('app.css'))
               .pipe(sourceMaps.write())
               .pipe(gulp.dest('app/styles'))
               .pipe(browserSync.reload({stream: true}));
});

gulp.task('templates', function() {
    return gulp.src('app/templates/_pug/**/*.pug')
               .pipe(plumber())
               .pipe(pug({
                   pretty: true
               }))
               .on('error', gutil.log)
               .pipe(gulp.dest('app/templates'))
               .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function(tmp) {
    gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/images'));
});


gulp.task('default', ['browserSync', 'scripts', 'styles'], function() {
    gulp.watch('app/scripts/**', ['scripts']);
    gulp.watch('app/styles/_scss/**', ['styles']);
    gulp.watch('app/templates/**', ['templates']);
    gulp.watch('app/images/**', ['images']);
});

/* 
 * @considerations of deploy tasks:
 * 
 * (clean and scaffold) | Shell commands for delete and create main folders.
 * (scripts-deploy)     | Compiling .coffee, concatenate all, minify and send to dist/scripts folder.
 * (styles-deploy)      | Compiling .scss, concatenate all, minify and send to dist/styles folder.
 * (templates-deploy)   | Migrating over all files for deployment. (Grab everything, which should include htaccess, robots, any hidden files, etc)
 * (images-deploy)      | Import all images files.
 * (deploy)             | Create a distribution version.
 * 
 */

gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/fonts',
      'mkdir dist/images',
      'mkdir dist/json',
      'mkdir dist/scripts',
      'mkdir dist/styles',
      'mkdir dist/templates'
    ]
  );
});

gulp.task('scripts-deploy', function() {
    return gulp.src(['app/libs/**/*.min.js', 'app/scripts/_coffee/**/*.coffee'])
               .pipe(plumber())
               .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
               .pipe(concat('app.js'))
               .pipe(uglify())
               .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles-deploy', function() {
    return gulp.src('app/styles/*.css')
               .pipe(plumber())
                .pipe(cleanCSS({debug: true}, function(details) {
                    console.log(details.name + ' Original size ... ' + details.stats.originalSize);
                    console.log(details.name + ' Minified size ... ' + details.stats.minifiedSize);
                }))
               .pipe(gulp.dest('dist/styles'));
});

gulp.task('images-deploy', function() {
    gulp.src(['app/images/**/*', '!app/images/README'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('templates-deploy', function() {
    gulp.src(['app/*', '!app/libs', '!app/tests'])
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
    gulp.src('app/.*')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
    gulp.src('app/fonts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/json/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/json'));
    gulp.src('app/templates/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist/templates'));
});

gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'templates-deploy'));

/* 
 * @considerations of push task:
 * 
 * This task performs the deploy via your ftp server.
 * 
 * 1. Using base = '.' will transfer everything to /public_html correctly. *(For deploy with new route Or using base = './<path-name-in-globs>' and .pipe(conn.dest('/public_html/<path-name-route>')); for rename a new route)
 * 2. Using base = './<path-name-in-globs>' will transfer to /public_html correctly. *(For deploy files in /public_html)
 * 3. Turn off buffering in gulp.src for best performance.
 * 
 */

gulp.task( 'push', function () {

	var conn = ftp.create({
		host:     '...',
		user:     '...',
		password: '...',
		parallel: 10,
		log:      gutil.log
	});

	var globs = [
		'dist/**'
	];

	return gulp.src(globs, {base: '.', buffer: false})
		       .pipe(conn.newer('/public_html'))
               .pipe(conn.dest('/public_html'));
});