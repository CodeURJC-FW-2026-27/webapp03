import fs from 'node:fs/promises';
import * as board from './board.js';

const DATA_FOLDER = './data';

let dataFile = 'data.json';

const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');

const destinations = JSON.parse(dataString);

if (await board.countPosts() === 0) {
    for (const destination of destinations) {
        await board.addPost(destination);
    }
    console.log('Demo destinations loaded');
}

await fs.mkdir(board.UPLOADS_FOLDER, { recursive: true });
await fs.mkdir(board.DATA_IMAGES_FOLDER, { recursive: true });
await fs.cp(board.DATA_IMAGES_FOLDER, board.UPLOADS_FOLDER, { recursive: true });