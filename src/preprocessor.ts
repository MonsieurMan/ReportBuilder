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

			// Add chapter class to all h1
			let h1 = doc.querySelectorAll('h1,h2,h3,h4');

			for(let i = 0; i < h1.length; i++) {
				h1[i].classList.add('chapter');
			}
			this.generateToc(doc);
			this.generateTof(doc);
			this.createFileToOut(doc.documentElement.innerHTML);
		});
	}

	private generateToc(doc: Document): void {
		let toc = doc.getElementsByClassName('toc')[0];
		let h1=0;
		let h2=0;
		let h3=0;
		let h4=0;
		
		let element = <Element>doc.getElementsByTagName('h1')[0];
		//Iterate on all element beginning by the first h1
		while(element.nextElementSibling) {
			switch(element.tagName) {
				case "H1" :{
					h1++;
					h2 = h3 = h4 = 0;
					let id = h1.toString() + ".";
					this.addIdAndCreateLi(id, element, toc, doc, 0);
					break;
				}
				case "H2" :{
					h2++;
					h3 = h4 = 0;
					let id = h1.toString() + "." + h2.toString() + ".";
					this.addIdAndCreateLi(id, element, toc, doc, 1);
					break;
				}
				case "H3" :{
					h3++;
					h4 = 0;
					let id = h1.toString() + "." + h2.toString() + "." + h3.toString() + ".";
					this.addIdAndCreateLi(id, element, toc, doc, 2);
					break;
				}
				case "H4" :{
					h4++;
					let id = h1.toString() + "." + h2.toString() + "." + h3.toString() + "." + h4.toString() + ".";
					this.addIdAndCreateLi(id, element, toc, doc, 3);
					break;
				}
			}
			element = element.nextElementSibling;
		}
	}

	private addIdAndCreateLi(id: string, element: Element, toc: Element, doc: Document, tab: number) {
		element.id = id;
		let li = doc.createElement('LI');
		let a = doc.createElement('A');
		a.setAttribute("href", "#" + id);
		a.style.paddingLeft = (tab * 20) + 'px';
		let text = doc.createTextNode(id + ' ' + element.textContent);
		a.appendChild(text);
		li.appendChild(a);
		toc.appendChild(li);
	}
	private addIdAndCreateLiFigure(id: string, element: Element, toc: Element, doc: Document, tab: number) {
		element.id = id;
		let li = doc.createElement('LI');
		let a = doc.createElement('A');
		a.setAttribute("href", "#" + id);
		a.style.paddingLeft = (tab * 20) + 'px';
		let text = doc.createTextNode(id  + '. ' + element.getElementsByTagName('name')[0].textContent);
		a.appendChild(text);
		li.appendChild(a);
		toc.appendChild(li);
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

	private generateTof(document: Document) {

		let tof = document.getElementsByClassName('tof')[0];
		let figures = document.getElementsByTagName('figure');
		for(let i=0 ; i < figures.length ; i++ )
		{
			this.addIdAndCreateLiFigure((i+1).toString(), figures[i], tof, document, 0);
		}
	}
}