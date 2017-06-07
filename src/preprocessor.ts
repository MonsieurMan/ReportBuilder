import * as fs from 'fs';
import { JSDOM, DOMWindow } from 'jsdom';
import * as path from 'path';

/**
 * Preprocessor for html documents
 * 
 * @export
 * @class Preprocessor
 */
export class Preprocessor {

	/**
	 * Creates an instance of Preprocessor.
	 * 
	 * @param {string} filePath the html file to preprocess
	 * @param {string} outputPath the path to output to
	 * @throws {Error} if the file is not found
	 * @memberof Preprocessor
	 */
	constructor(private filePath: string, private outputPath: string) {
		fs.realpath(filePath, (err, realPath) => {
			if (err) throw err;
			fs.exists(realPath, exists => {
				if (!exists) throw new Error('File not found : : ' + realPath);
			})
		});

	}

	/**
	 * Execute the preprocessing on the document
	 * 
	 * 
	 * @memberof Preprocessor
	 */
	public execute(): void {
		fs.readFile(this.filePath, 'utf8', (err, html) => {
			if (err) throw err;

			let window = new JSDOM(html.toString()).window;
			let doc = window.document;

			doc.getElementsByTagName('h1')[0].classList.add('chapter');

			this.createFileToOut(doc.documentElement.innerHTML);
		});
	}

	/**
	 * Create the html file in the out directory
	 * 
	 * @private
	 * @param {string} content Acutal content of the html file
	 * 
	 * @memberof Preprocessor
	 */
	private createFileToOut(content: string): void {
		fs.realpath(this.outputPath, (err, realPath) => {
			fs.writeFile(realPath + "/report.html", content, err =>{ 
				if (err) throw err;
			});
		});
	}

}