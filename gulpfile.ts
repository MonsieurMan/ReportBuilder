import * as marked from 'marked';
import { series, parallel } from 'gulp';
import { readFile, writeFile } from 'fs-extra';
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

export async function preprocessHTML() {
    const preprocessor = new Preprocessor('out/report.html', 'out/report.p.html');
    await preprocessor.execute();
}

export async function HTMLToPDF() {
    return exec('weasyprint out/report.p.html out/report.pdf -s out/style.css');
}

export default series(parseMarkdown, preprocessHTML, HTMLToPDF);
