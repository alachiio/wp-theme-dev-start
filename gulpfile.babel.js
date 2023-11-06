import gulp from "gulp";
import yargs from "yargs";
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import cleanCSS from "gulp-clean-css";
import gulpif from "gulp-if";
import autoprefixer from "gulp-autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import del from 'gulp-clean';
import rename from "gulp-rename";
import webpack from "webpack-stream";
import named from 'vinyl-named';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json';
import uglify from  "gulp-uglify-es";
import WebpackConfig from './webpack.config';

const sass = gulpSass(nodeSass)

const PRODUCTION = yargs.argv.prod;

WebpackConfig.mode = PRODUCTION ? 'production' : 'development';

const paths = {
    styles: {
        src : 'src/scss/**/*.scss',
        dest: 'assets/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'assets/js'
    },
    package: {
        src: ['**/*', '!.vscode', '!.idea', '!node_modules{,/**}', '!packaged{,/**}', '!assets/src{,/**}', '!.babelrc', '!.gitignore', '!gulpfile.babel.js', '!webpack.config.js', '!package.json', '!package-lock.json'],
        dest: 'packaged'
    }
};

export const clean = () => {
    return gulp.src('assets', { read: false, allowEmpty: true })
        .pipe(del());
}

export const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(autoprefixer({
            Browserslist: ['last 99 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
        .pipe(autoprefixer({
            Browserslist: ['last 99 versions'],
            cascade: false
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(paths.styles.dest));
}

export const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(named())
        .pipe(webpack(WebpackConfig))
        .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(gulp.dest(paths.scripts.dest));
}

export const compress = () => {
    return gulp.src(paths.package.src)
        .pipe(replace('_themename', info.name))
        .pipe(zip(`${info.name}.zip`))
        .pipe(gulp.dest(paths.package.dest));
}

export const watch = () => {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

export const dev = gulp.series(clean, gulp.parallel(styles, scripts), watch);
export const build = gulp.series(clean, gulp.parallel(styles, scripts));
export const bundle = gulp.series(build, compress);

export default dev;
