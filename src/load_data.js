import fs from 'node:fs/promises';
import * as board from './board.js';

const UPLOADS_FOLDER = './uploads';
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

await fs.mkdir(UPLOADS_FOLDER, { recursive: true });