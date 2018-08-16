import * as fs from 'fs-extra';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { NoTableOfFigureError, NoTableOfContentError } from './errors';

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
	 */
  constructor(private filePath: string, private outputPath: string) {
    fs.accessSync(path.resolve(filePath));
  }

  /**
   * Execute the preprocessing on the document
   *
   * @memberof Preprocessor    
   */
  public async execute() {
    const html = await fs.readFile(this.filePath, 'utf8');

    const window = new JSDOM(html.toString()).window;
    const doc = window.document;

    this.addChapterClassToHeaders(doc);
    this.generateToc(doc);
    this.generateTof(doc);
    await this.createFileToOut(doc.documentElement.innerHTML);
  }

  private addChapterClassToHeaders(doc: Document) {
    const h1 = doc.querySelectorAll('h1,h2,h3,h4');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < h1.length; i++) {
      h1[i].classList.add('chapter');
    }
  }

  private generateToc(doc: Document): void {
    const toc = doc.getElementsByClassName('toc')[0];
    if (toc === undefined) {
      throw new NoTableOfContentError();
    }
    let h1 = 0;
    let h2 = 0;
    let h3 = 0;
    let h4 = 0;

    let element: Element = doc.getElementsByTagName('h1')[0];
    // Iterate on all element beginning by the first h1
    while (element.nextElementSibling) {
      switch (element.tagName) {
        case 'H1': {
          h1++;
          h2 = h3 = h4 = 0;
          const id = h1.toString() + '.';
          this.addIdAndCreateLi(id, element, toc, doc, 0);
          break;
        }
        case 'H2': {
          h2++;
          h3 = h4 = 0;
          const id = h1.toString() + '.' + h2.toString() + '.';
          this.addIdAndCreateLi(id, element, toc, doc, 1);
          break;
        }
        case 'H3': {
          h3++;
          h4 = 0;
          const id = h1.toString() + '.' + h2.toString() + '.' + h3.toString() + '.';
          this.addIdAndCreateLi(id, element, toc, doc, 2);
          break;
        }
        case 'H4': {
          h4++;
          const id = h1.toString() + '.' + h2.toString() + '.' + h3.toString() + '.' + h4.toString() + '.';
          this.addIdAndCreateLi(id, element, toc, doc, 3);
          break;
        }
      }
      element = element.nextElementSibling;
    }
  }

  private addIdAndCreateLi(id: string, element: Element, toc: Element, doc: Document, tab: number) {
    element.id = id;
    const li = doc.createElement('li');
    const a = doc.createElement('a');
    a.setAttribute('href', '#' + id);
    a.style.paddingLeft = (tab * 20) + 'px';
    const text = doc.createTextNode(id + ' ' + element.textContent);
    a.appendChild(text);
    li.appendChild(a);
    toc.appendChild(li);
  }

  private addIdAndCreateLiFigure(id: string, image: Element, tof: Element, doc: Document, tab: number) {
    image.id = id;

    this.wrapInFigureTag(image, doc, id);
    this.addToTOF(doc, id, tab, image, tof);
  }

  private addToTOF(doc: Document, id: string, tab: number, image: Element, tof: Element) {
    const li = doc.createElement('li');
    const a = doc.createElement('a');
    a.setAttribute('href', '#' + id);
    a.style.paddingLeft = (tab * 20) + 'px';
    const text = doc.createTextNode(id + '. ' + image.getAttribute('alt'));
    a.appendChild(text);
    li.appendChild(a);
    tof.appendChild(li);
  }

  private wrapInFigureTag(image: Element, doc: Document, id: string) {
    const imageParent = image.parentElement;
    imageParent.removeChild(image);
    const figure = doc.createElement('figure');
    const figCaption = doc.createElement('figcaption');
    figCaption.textContent = image.getAttribute('alt');
    figure.appendChild(image);
    figure.appendChild(figCaption);
    imageParent.appendChild(figure);
  }

  /**
	  * Create the html file in the out directory
	  *
	  * @private
	  * @param {string} content Acutal content of the html file
	  *
	  * @memberof Preprocessor
	  */
  private async createFileToOut(content: string) {
    try {
      await fs.writeFile(path.resolve(this.outputPath), content, { flag: 'w' });
    } catch (err) {
      console.error(err);
    }
  }

  private generateTof(document: Document) {
    const tof = document.getElementsByClassName('tof')[0];
    if (tof === undefined) {
      throw new NoTableOfFigureError();
    }
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      this.addIdAndCreateLiFigure((i + 1).toString(), images[i], tof, document, 0);
    }
  }
}
