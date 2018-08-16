import * as marked from 'marked';
import { series, parallel, src, dest } from 'gulp';
import { readFile, writeFile } from 'fs-extra';
import * as scss from 'gulp-sass';
import { exec } from 'child_process';
import { Preprocessor } from './src/preprocessor';

/** TODO:
 * md -> html marked
 * html -> html preprocessor
 * scss -> css
 * assets -> out/assets
 * html -> pdf weasyprint
 */

export async function parseMarkdown() {
    const markdown = (await readFile('files/report.md')).toString();
    const html = marked(markdown);
    await writeFile('out/report.html', html);
}

export async function processSCSS() {
    return src('files/styles/**/*.scss')
        .pipe(scss())
        .pipe(dest('./out'));
}

export async function copyAssets() {
    return src('files/assets/**')
        .pipe(dest('./out/assets'));
}

export async function preprocessHTML() {
    const preprocessor = new Preprocessor('out/report.html', 'out/report.p.html');
    await preprocessor.execute();
}

export async function HTMLToPDF() {
    return exec('weasyprint out/report.p.html out/report.pdf -s out/style.css');
}

export default series(
    parallel(
        series(
            parseMarkdown,
            preprocessHTML
        ),
        processSCSS,
        copyAssets
    ),
    HTMLToPDF
);
