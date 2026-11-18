import fs from 'node:fs/promises';
import * as travel from './travel.js';

const DATA_FOLDER = './data';

let dataFile = 'data.json';

const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');

const destinations = JSON.parse(dataString);

if (await travel.countDestinations() === 0) {
    for (const destination of destinations) {
        await travel.addDestination(destination);
    }
    console.log('Demo destinations loaded');
}
await travel.ensureActivityIds();

await fs.mkdir(travel.UPLOADS_FOLDER, { recursive: true });
await fs.mkdir(travel.DATA_IMAGES_FOLDER, { recursive: true });
await fs.cp(travel.DATA_IMAGES_FOLDER, travel.UPLOADS_FOLDER, { recursive: true });