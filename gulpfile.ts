import { series, parallel, src, dest, watch } from 'gulp';
import * as rename from 'gulp-rename';
import * as cache from 'gulp-cached';
import * as scss from 'gulp-sass';
import * as concat from 'gulp-concat';

import { exec } from 'child_process';

import { preprocessHTML } from './src/gulp-plugins/preprocess-html';
import { parseMarkdown } from './src/gulp-plugins/parse-markdown';

export function markdownToHTML() {
    return src(['files/report.md', 'files/chapters/**/*.md'])
        .pipe(concat('report.md'))
        .pipe(cache('markdown'))
        .pipe(parseMarkdown())
        .pipe(preprocessHTML())
        .pipe(rename('report.html'))
        .pipe(dest('out/temp'))
}

export function processSCSS() {
    return src('files/styles/**/*.scss')
        // .pipe(cache('scss'))
        .pipe(scss())
        .pipe(dest('./out/temp'));
}

export function copyAssets() {
    return src('files/assets/**')
        .pipe(cache('assets'))
        .pipe(dest('./out/temp/assets'));
}

export function HTMLToPDF() {
    return exec('/usr/bin/weasyprint out/temp/report.html out/report.pdf -s out/temp/style.css');
}

export const build = series(
    parallel(
        markdownToHTML,
        processSCSS,
        copyAssets
    ),
    HTMLToPDF
);

export default function () {
    console.log('Start watching `files/**`');
    watch('files/**', { ignoreInitial: false }, build)
}
