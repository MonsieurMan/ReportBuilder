import { JSDOM } from 'jsdom';
import { NoTableOfFigureError, NoTableOfContentError } from './errors';

/**
 * Add TOC and TOF to content
 *
 * @memberof Preprocessor    
 */
export async function addTOCandTOF(content: string): Promise<string> {
  const window = new JSDOM(content).window;
  const doc = window.document;

  addChapterClassToHeaders(doc);
  generateToc(doc);
  generateTof(doc);

  return doc.documentElement.innerHTML;
}

function addChapterClassToHeaders(doc: Document) {
  const h1 = doc.querySelectorAll('h1,h2,h3,h4');
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < h1.length; i++) {
    h1[i].classList.add('chapter');
  }
}

function generateToc(doc: Document): void {
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
        addIdAndCreateLi(id, element, toc, doc, 0);
        break;
      }
      case 'H2': {
        h2++;
        h3 = h4 = 0;
        const id = h1.toString() + '.' + h2.toString() + '.';
        addIdAndCreateLi(id, element, toc, doc, 1);
        break;
      }
      case 'H3': {
        h3++;
        h4 = 0;
        const id = h1.toString() + '.' + h2.toString() + '.' + h3.toString() + '.';
        addIdAndCreateLi(id, element, toc, doc, 2);
        break;
      }
      case 'H4': {
        h4++;
        const id = h1.toString() + '.' + h2.toString() + '.' + h3.toString() + '.' + h4.toString() + '.';
        addIdAndCreateLi(id, element, toc, doc, 3);
        break;
      }
    }
    element = element.nextElementSibling;
  }
}

function addIdAndCreateLi(id: string, element: Element, toc: Element, doc: Document, tab: number) {
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

function addIdAndCreateLiFigure(id: string, image: Element, tof: Element, doc: Document, tab: number) {
  image.id = id;

  wrapInFigureTag(image, doc, id);
  addToTOF(doc, id, tab, image, tof);
}

function addToTOF(doc: Document, id: string, tab: number, image: Element, tof: Element) {
  const li = doc.createElement('li');
  const a = doc.createElement('a');
  a.setAttribute('href', '#' + id);
  a.style.paddingLeft = (tab * 20) + 'px';
  const text = doc.createTextNode(id + '. ' + image.getAttribute('alt'));
  a.appendChild(text);
  li.appendChild(a);
  tof.appendChild(li);
}

function wrapInFigureTag(image: Element, doc: Document, id: string) {
  const imageParent = image.parentElement;
  imageParent.removeChild(image);
  const figure = doc.createElement('figure');
  const figCaption = doc.createElement('figcaption');
  figCaption.textContent = image.getAttribute('alt');
  figure.appendChild(image);
  figure.appendChild(figCaption);
  imageParent.appendChild(figure);
}



function generateTof(document: Document) {
  const tof = document.getElementsByClassName('tof')[0];
  if (tof === undefined) {
    throw new NoTableOfFigureError();
  }
  const images = document.getElementsByTagName('img');
  for (let i = 0; i < images.length; i++) {
    addIdAndCreateLiFigure((i + 1).toString(), images[i], tof, document, 0);
  }
}
