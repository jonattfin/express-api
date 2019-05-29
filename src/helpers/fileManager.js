import fs from 'fs';

export function writeToFile(fileName, content = {}) {
  const writeStream = fs.createWriteStream(`./${fileName}`);

  writeStream.write(JSON.stringify(content, null, '\t'));

  // This is here incase any errors occur
  writeStream.on('error', (error) => { throw error; });
}
