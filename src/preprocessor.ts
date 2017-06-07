import * as fs from 'fs';
import {JSDOM, DOMWindow } from 'jsdom';

/**
 * Preprocessor for html documents
 * 
 * @export
 * @class Preprocessor
 */
export class Preprocessor {
	private __filePath: string;

	/**
	 * Creates an instance of Preprocessor.
	 * 
	 * @param {string} filePath the html file to preprocess
	 * @throws {Error} if the file is not found
	 * @memberof Preprocessor
	 */
	constructor(filePath: string) {
		this.__filePath = filePath;

		fs.exists(filePath, exists =>{
			if(!exists) throw new Error('File not found : : ' + filePath);
		})
	}

	/**
	 * Execute the preprocessing on the document
	 * 
	 * 
	 * @memberof Preprocessor
	 */
	public execute(): void {
		fs.readFile(this.__filePath, 'utf8', (err, html) => {
			let doc = new JSDOM(html.toString()).window.document;
			//TODO: do stuff with the document and rewrite it to the out directory
			console.log('Did stuff');
		});
	}

}