const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const nodemon = require('gulp-nodemon');
const sync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const jpegrecompress = require('imagemin-jpeg-recompress');
const clean = require('gulp-clean');

gulp.task('scripts', () => {
  gulp.src([
    'src/assets/scripts/vendor/*.js',
    'src/assets/scripts/components/*.js',
    'src/assets/scripts/*.js',
  ])
    .pipe(concat('scripts.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .on('error', console.error.bind(console))
    .pipe(uglify())
    .pipe(gulp.dest('public'))
    .pipe(sync.stream());
});

gulp.task('styles', () => {
  gulp.src('./src/assets/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCss())
    .pipe(gulp.dest('./public/'))
    .pipe(sync.stream());
});

gulp.task('images', () => {
  gulp.src('./src/assets/images/**/*')
    .pipe(imagemin([
      jpegrecompress({
        loops: 4,
        min: 80,
        max: 95,
        quality: 'low',
      }),
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo(),
    ]))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('fonts', () => {
  gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('icons', () => {
  gulp.src('./src/assets/icons/*.svg')
    .pipe(sprite({
      mode: {
        symbol: {
          dest: '',
          sprite: 'icons.svg',
        },
      },
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'bin/express',
    ext: 'js ejs',
    watch: ['src'],
    ignore: ['src/assets'],
  }).on('start', sync.reload);
});

gulp.task('browser-sync', ['nodemon'], () => {
  sync.init(null, {
    proxy: 'http://localhost:3000',
    browser: 'google chrome',
    port: 3001,
    reloadDelay: 2000, // wait for nodemon to restart
  });
});

gulp.task('clean', () => {
  gulp.src('./public/*', { read: false })
    .pipe(clean());
});

gulp.task('build', ['clean', 'styles', 'scripts', 'fonts', 'images', 'icons']);

gulp.task('default', ['browser-sync'], () => {
  gulp.watch('src/assets/styles/**/*', ['styles']);
  gulp.watch('src/assets/scripts/**/*', ['scripts']);
  gulp.watch('src/assets/fonts/**/*', ['fonts']).on('change', sync.reload);
  gulp.watch('src/assets/images/**/*', ['images']).on('change', sync.reload);
  gulp.watch('src/assets/icons/**/*', ['icons']).on('change', sync.reload);
});
