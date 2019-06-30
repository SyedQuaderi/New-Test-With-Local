    // Gulp.js configuration

    var
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    htmlInjector = require("bs-html-injector"),
    reload = browserSync.reload,
    inject = require('gulp-inject'),
    cleanCSS = require('gulp-clean-css'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    cache  = require('gulp-cache'),
    del = require('del'),
    runSequence = require('gulp-sequence').use(gulp),
    inlineimg = require('gulp-inline-image'),
    dataJson = require("gulp-data-json"),
    hb = require('gulp-hb'),
    jsonminify = require('gulp-jsonminify'),


    // development mode?
    devBuild = (process.env.NODE_ENV !== 'production'),

    // folders
    folder = {
    src: 'src/',
    build: 'build/',
    root: " ",
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
        
    dist: 'dist',
    distIndex: '*.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
    }
    ;

    
    // Compile sass into CSS & auto-inject into browsers
    gulp.task('sass', function() {
        return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','src/scss/**/*.scss']) // Gets all files ending with .scss in src/scss
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
    });

    // Move the javascript files into our /src/js folder
    gulp.task('js', function() {
        return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js'])
            .pipe(gulp.dest("src/js"))
    });

    gulp.task('html', function() {
        return gulp.src('*.html') // Gets all files ending with .html in root folder
        .pipe(htmlclean())
        .pipe(gulp.dest('src/html'))
        .pipe(browserSync.reload({
          stream: true
        }))
    });
    
    gulp.task('child-html', function() {
        return gulp.src('src/html/**/*.html') // Gets all files ending with .html in html folder
        .pipe(htmlclean())
        .pipe(gulp.dest('src/html'))
        .pipe(browserSync.reload({
          stream: true
        }))
    });

    gulp.task('child-html-dist', function() {
        return gulp.src('src/html/**/*.html') // Gets all files ending with .html in html folder
        .pipe(htmlclean())
        .pipe(gulp.dest('dist/src/html'))
        .pipe(browserSync.reload({
          stream: true
        }))
    });

    gulp.task("handlebars", function() {
        return gulp.src("src/**/*.JSON")
        .pipe(dataJson())
        .pipe(hb())
        .pipe(gulp.dest("dest"));
    });

    gulp.task('images-new', function(){
       process.chdir('./src');
    return gulp.src('./images/**/*.+(png|jpg|gif|svg)')
      .pipe(cache(imagemin({
          // Setting interlaced to true
          interlaced: true
        })))
      .pipe(gulp.dest('../dist/images'));
    process.chdir('../');

   });

    gulp.task('build-images', function () {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/src/images'))
     });

    gulp.task('useref', function(){
      return gulp.src('*.html')
        .pipe(useref())
         // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.JSON',jsonminify()))
        .pipe(gulp.dest('dist'))
    });

    

    gulp.task('images', function(){
      return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
      .pipe(cache(imagemin({
          // Setting interlaced to true
          interlaced: true
        })))
      .pipe(inlineimg('images'))
      .pipe(gulp.dest('dist/src/images'))
    });

    gulp.task('fonts', function() {
      return gulp.src('src/fonts/**/*')
      .pipe(gulp.dest('dist/src/fonts'))
    });

    gulp.task('clean:dist', function(callback) {
        callback();
        return del.sync('dist');
        
    });

    gulp.task('cache:clear', function (callback) {
        return cache.clearAll(callback)
    })

    gulp.task('JSNew', function(){
        return gulp.src('src/js/**/*.js')
            .pipe(gulp.dest("src/js"))
    });

    // Static Server + watching scss/html files
    gulp.task('browserSync', function() {
      browserSync.init({
          watch: true,
        //logPrefix: "My New Project",
        //logConnections: true,
        //logLevel: "debug",
        //tunnel: "http://my-private-site.localtunnel.me",
        //online: true,
        //browser: "google chrome",
          //module: "bs-snippet-injector",
        server: {
          baseDir: './'
        }
      })

    });

    // Compile sass into CSS & auto-inject into browsers


    // watch for changes
    gulp.task('watch', gulp.parallel('browserSync', 'sass', function(done) {

        gulp.watch("src/scss/**/*.scss", gulp.series('sass'));
        gulp.watch("*.html", gulp.series('html'));    
        //gulp.watch('src/js/**/*.js', gulp.series('useref'));
        gulp.watch('src/js/**/*.js', gulp.series('js'));
        gulp.watch('src/images/**/*.+(png|jpg|gif|svg)', gulp.series('images'));
        gulp.watch("src/html/**/*.html", gulp.series('child-html')); 
        browserSync.reload();
        done();
    }));

    // Build all the gulp task together
    
    gulp.task('build-project', gulp.series('clean:dist', 'sass', 'useref', 'build-images', 'fonts',  'child-html-dist', function (callback){
        callback();
        console.log("\t\t All the Production files Build successsfully");
    }))
    
    // Running Default Gulp using gulp-sequence 
    gulp.task('default', gulp.series('clean:dist',  ['watch'] ));