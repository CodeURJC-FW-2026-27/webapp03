import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import { ObjectId } from 'mongodb';

import * as board from './board.js';

const router = express.Router();
export default router;

const upload = multer({ dest: board.UPLOADS_FOLDER });
const displayValues = {
    economical: 'Económico',
    medium: 'Medio',
    high: 'Alto',
    luxury: 'Lujo',
    winter: 'Invierno',
    spring: 'Primavera',
    summer: 'Verano',
    autumn: 'Otoño'
};

const formatValue = (value) => {
    const normalized = String(value || '').toLocaleLowerCase('es');
    if (Object.hasOwn(displayValues, normalized)) return displayValues[normalized];
    return normalized.charAt(0).toLocaleUpperCase('es') + normalized.slice(1);
};

const formatDestination = (destination) => ({
    ...destination,
    imageUrl: destination.imageFilename
        ? `/post/${destination._id}/image`
        : destination.imageUrl,
    priceRange: formatValue(destination.priceRange),
    recommendedSeason: formatValue(destination.recommendedSeason)
});

const renderNotice = (res, status, title, message, actionUrl, actionLabel) => {
    res.status(status).render('notice', { title, message, actionUrl, actionLabel });
};

const renderDestinationDetail = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    const destination = await board.getPost(req.params.id);
    if (!destination) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    res.render('detail_page', { destination: formatDestination(destination) });
};

const renderIndex = async (_req, res) => {
    const destinations = await board.getPosts();
    res.render('index', { destinations: destinations.map(formatDestination) });
};

router.get('/', renderIndex);
router.get('/index.html', renderIndex);

router.get('/new_element.html', (_req, res) => res.render('new_element'));

const createDestination = async (req, res) => {
    const destination = {
        name: String(req.body.name || '').trim(),
        country: String(req.body.country || '').trim(),
        continent: String(req.body.continent || '').trim(),
        priceRange: String(req.body.priceRange || ''),
        recommendedSeason: String(req.body.recommendedSeason || ''),
        description: String(req.body.description || '').trim()
    };
    const errors = [];

    if (!destination.name) {
        errors.push('El nombre del destino es obligatorio.');
    } else {
        if (!/^\p{Lu}/u.test(destination.name)) {
            errors.push('El nombre debe comenzar con una letra mayúscula.');
        }
        if (await board.getPostByName(destination.name)) {
            errors.push('Ya existe un destino con ese nombre.');
        }
    }

    if (!destination.country) errors.push('El país es obligatorio.');
    if (!destination.continent) errors.push('El continente es obligatorio.');
    if (!destination.priceRange) {
        errors.push('Selecciona un rango de precio válido.');
    }
    if (!destination.recommendedSeason) {
        errors.push('Selecciona una época recomendada válida.');
    }
    if (destination.description.length < 3 || destination.description.length > 500) {
        errors.push('La descripción debe tener entre 3 y 500 caracteres.');
    }
    if (!req.file) errors.push('Selecciona una imagen.');

    if (errors.length) {
        if (req.file) await fs.rm(req.file.path, { force: true });
        return renderNotice(
            res,
            400,
            'No se pudo crear el destino',
            errors.join(' '),
            '/new_element.html',
            'Volver al formulario'
        );
    }

    destination._id = new ObjectId();
    await fs.copyFile(
        req.file.path,
        board.DATA_IMAGES_FOLDER + '/' + req.file.filename
    );
    destination.imageFilename = req.file.filename;
    destination.imageUrl = `/post/${destination._id}/image`;
    destination.activities = [];
    const result = await board.addPost(destination);

    res.redirect(303, `/destinations/${result.insertedId.toString()}/created`);
};

router.post('/destinations/new', upload.single('image'), createDestination);
router.post('/post/new', upload.single('image'), createDestination);

router.get('/destinations/:id/created', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    const destination = await board.getPost(req.params.id);
    if (!destination) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    res.render('notice', {
        title: 'Destino creado correctamente',
        message: `${destination.name} se ha añadido a SuperTrip.`,
        actionUrl: '/',
        actionLabel: 'Volver al inicio',
        detailUrl: `/destinations/${destination._id}`,
        detailLabel: 'Ver destino'
    });
});

router.get('/destinations/:id', renderDestinationDetail);
router.get('/destinations/:id/edit', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    const destination = await board.getPost(req.params.id);

    if (!destination) {
        return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
    }

    res.render('new_element', {
    destination,
    isEconomical: formatValue(destination.priceRange) === 'Económico',
    isMedium: formatValue(destination.priceRange) === 'Medio',
    isHigh: formatValue(destination.priceRange) === 'Alto',
    isLuxury: formatValue(destination.priceRange) === 'Lujo'
});
});

router.get('/post/:id', renderDestinationDetail);

router.get('/post/:id/delete', async (req, res) => {
    const destination = await board.deletePost(req.params.id);

    if (destination && destination.imageFilename) {
        await fs.rm(board.UPLOADS_FOLDER + '/' + destination.imageFilename, { force: true });
        await fs.rm(board.DATA_IMAGES_FOLDER + '/' + destination.imageFilename, { force: true });
    }

    renderNotice(res, 200, 'Destino eliminado', 'El destino se ha eliminado.', '/', 'Volver al inicio');
});

router.get('/post/:id/image', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.sendStatus(404);
    }

    const destination = await board.getPost(req.params.id);
    if (!destination || !destination.imageFilename) {
        return res.sendStatus(404);
    }

    res.download(board.UPLOADS_FOLDER + '/' + destination.imageFilename);
});
