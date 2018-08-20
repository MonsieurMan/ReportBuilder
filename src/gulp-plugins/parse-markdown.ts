import * as marked from 'marked';
import * as through from 'through2';

import * as hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';

const markedOptions: marked.MarkedOptions = {
    smartypants: true, 
    highlight: (code, lang) =>  hljs.highlight(lang, code).value
};

export const parseMarkdown = () => through.obj((file, _, cb) => {
    const html = marked.setOptions(markedOptions)(file.contents.toString());
    file.contents = Buffer.from(html);
    cb(null, file);
});
