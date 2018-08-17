import * as marked from 'marked';
import * as through from 'through2';

export const parseMarkdown = () => through.obj((file, _, cb) => {
    const html = marked.setOptions({ smartypants: true })(file.contents.toString());
    file.contents = Buffer.from(html);
    cb(null, file);
});
