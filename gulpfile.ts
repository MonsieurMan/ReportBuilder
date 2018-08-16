import * as marked from 'marked';
import { series, parallel, src, dest, watch } from 'gulp';
import * as through from "through2";
import * as scss from 'gulp-sass';
import * as rename from 'gulp-rename';
import * as cache from 'gulp-cached';
import { exec } from 'child_process';
import { addTOCandTOF } from './src/preprocessor';

/** TODO:
 * md -> html marked
 * html -> html preprocessor
 * scss -> css
 * assets -> out/assets
 * html -> pdf weasyprint
 */

const parseMarkdown = () => through.obj((file, _, cb) => {
    const html = marked(file.contents.toString());
    file.contents = Buffer.from(html);
    cb(null, file);
});

const preprocessHTML = () => through.obj(async (file, _, cb) => {
    try {
        const newFile = await addTOCandTOF(file.contents.toString());
        file.contents = Buffer.from(newFile);
        cb(null, file)
    } catch (err) {
        cb(err);
    }
});

export function processSCSS() {
    return src('files/styles/**/*.scss')
        .pipe(cache('assets'))
        .pipe(scss())
        .pipe(dest('./out'));
}

export function copyAssets() {
    return src('files/assets/**')
        .pipe(cache('assets'))
        .pipe(dest('./out/assets'));
}



export async function HTMLToPDF() {
    return exec('weasyprint out/report.html out/report.pdf -s out/style.css');
}

function markdown() {
    return src('files/report.md')
        .pipe(cache('markdown'))
        .pipe(parseMarkdown())
        .pipe(preprocessHTML())
        .pipe(rename('report.html'))
        .pipe(dest('out'))
}

export function watchBuild() {
    watch('files/**', { ignoreInitial: false }, defaultTask);
}

const defaultTask = series(parallel(markdown, processSCSS, copyAssets), HTMLToPDF);
export default defaultTask;
