import { Preprocessor } from './preprocessor';

const args = process.argv.slice(2);
const { filePath, outputPath } = { filePath: args[0], outputPath: args[1] };

let preprocessor = new Preprocessor(filePath, outputPath);
preprocessor.execute();
