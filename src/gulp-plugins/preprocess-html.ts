import { addTOCandTOF } from '../preprocessor';
import * as through from 'through2';

export const preprocessHTML = () => through.obj(async (file, _, cb) => {
    try {
        const newFile = await addTOCandTOF(file.contents.toString());
        file.contents = Buffer.from(newFile);
        cb(null, file);
    }
    catch (err) {
        cb(err);
    }
});
