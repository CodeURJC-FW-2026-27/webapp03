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
    autumn: 'Otoño',
    adventure: 'Aventura',
    culture: 'Cultura',
    gastronomy: 'Gastronomía',
    nature: 'Naturaleza'
};

const priceRangeOptions = [
    { value: '', label: 'Todos' },
    { value: 'economical', label: 'Económico' },
    { value: 'medium', label: 'Medio' },
    { value: 'high', label: 'Alto' },
    { value: 'luxury', label: 'Lujo' }
];

const formatValue = (value) => {
    const normalized = String(value || '').toLocaleLowerCase('es');
    if (Object.hasOwn(displayValues, normalized)) return displayValues[normalized];
    return normalized.charAt(0).toLocaleUpperCase('es') + normalized.slice(1);
};

const formatDestination = (destination) => ({
    ...destination,
    priceRange: formatValue(destination.priceRange),
    recommendedSeason: formatValue(destination.recommendedSeason),
    activities: (destination.activities || []).map(activity => ({
        ...activity,
        category: formatValue(activity.category)
    }))
});

const renderError = (res, status, title, message, actionUrl, actionLabel) => {
    res.status(status).render('partials/error', {
        title,
        message,
        actionUrl,
        actionLabel
    });
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

const renderIndex = async (req, res) => {
    const currentPage = Math.max(1, parseInt(req.query.page) || 1);
    const search = String(req.query.search || '').trim();
    const priceRange = typeof req.query.priceRange === 'string'
        && priceRangeOptions.some((option) => option.value === req.query.priceRange && option.value)
        ? req.query.priceRange
        : '';
    const limit = 6;
    const totalDestinations = await board.countPosts(search, priceRange);
    const totalPages = Math.ceil(totalDestinations / limit);
    const destinations = await board.getPosts(currentPage, limit, search, priceRange);
    const filterParams = new URLSearchParams();
    if (search) filterParams.set('search', search);
    if (priceRange) filterParams.set('priceRange', priceRange);
    const filterQuery = filterParams.toString();
    const paginationQuery = filterQuery ? `&${filterQuery}` : '';
    const categories = priceRangeOptions.map((option) => {
        const categoryParams = new URLSearchParams();
        if (option.value) categoryParams.set('priceRange', option.value);
        if (search) categoryParams.set('search', search);
        const categoryQuery = categoryParams.toString();

        return {
            ...option,
            active: option.value === priceRange,
            url: categoryQuery ? `/?${categoryQuery}` : '/'
        };
    });

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            number: i,
            numero: `${i}${paginationQuery}`,
            active: i === currentPage
        });
    }

    res.render('index', {
        destinations: destinations.map(formatDestination),
        currentPage,
        totalPages,
        pages,
        categories,
        priceRange,
        search,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < totalPages,
        previousPage: `${currentPage - 1}${paginationQuery}`,
        nextPage: `${currentPage + 1}${paginationQuery}`
    });
};

router.get('/', renderIndex);
router.get('/index.html', renderIndex);

router.get('/new_element.html', (_req, res) => res.render('new_element'));

const createDestination = async (req, res) => {
    const isEditing = req.params.id !== undefined;
    let previousDestination = null;

    if (isEditing) {
        if (!ObjectId.isValid(req.params.id)) {
            return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
        }

        previousDestination = await board.getPost(req.params.id);

        if (!previousDestination) {
            return renderNotice(res, 404, 'Destino no encontrado', 'No existe ese destino.', '/', 'Volver al inicio');
        }
    }
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
        const existingDestination = await board.getPostByName(destination.name);

        if (
            existingDestination &&
            existingDestination._id.toString() !== req.params.id
        ) {
            errors.push('Ya existe un destino con ese nombre.');
        }
        }

    if (!destination.country) errors.push('El país es obligatorio.');
    if (!destination.continent) errors.push('El continente es obligatorio.');
    const validPriceRanges = ['economical', 'medium', 'high', 'luxury'];
    const validSeasons = ['winter', 'spring', 'summer', 'autumn'];

    if (!validPriceRanges.includes(destination.priceRange)) {
        errors.push('Selecciona un rango de precio válido.');
    }

    if (!validSeasons.includes(destination.recommendedSeason)) {
        errors.push('Selecciona una época recomendada válida.');
    }

    if (destination.description.length < 3 || destination.description.length > 500) {
        errors.push('La descripción debe tener entre 3 y 500 caracteres.');
    }
    if (!req.file && !isEditing) {
    errors.push('Selecciona una imagen.');
    }

    if (errors.length) {
        if (req.file) await fs.rm(req.file.path, { force: true });
        return renderError(
            res,
            400,
            isEditing ? 'No se pudo actualizar el destino' : 'No se pudo crear el destino',
            errors.join(' '),
            isEditing ? `/destinations/${req.params.id}/edit` : '/new_element.html',
            'Volver al formulario'
        );
    }

    if (req.file) {
    destination.imageFilename = req.file.filename;
    destination.imageUrl = `/uploads/${req.file.filename}`;
}

if (isEditing) {
    await board.updatePost(req.params.id, destination);

    if (req.file && previousDestination.imageFilename) {
        await fs.rm(
            `${board.UPLOADS_FOLDER}/${previousDestination.imageFilename}`,
            { force: true }
        );
    }

    return res.render('notice', {
        title: 'Destino actualizado',
        message: 'Los cambios se han guardado correctamente.',
        actionUrl: '/',
        actionLabel: 'Volver al menú principal',
        detailUrl: `/destinations/${req.params.id}`,
        detailLabel: 'Volver al destino'
});
}

destination.activities = [];
const result = await board.addPost(destination);

res.redirect(303, `/destinations/${result.insertedId.toString()}/created`);
};

router.post('/destinations/new', upload.single('image'), createDestination);
router.post('/post/new', upload.single('image'), createDestination);
router.post('/destinations/:id/edit', upload.single('image'), createDestination);

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
        isLuxury: formatValue(destination.priceRange) === 'Lujo',
        isWinter: formatValue(destination.recommendedSeason) === 'Invierno',
        isSpring: formatValue(destination.recommendedSeason) === 'Primavera',
        isSummer: formatValue(destination.recommendedSeason) === 'Verano',
        isAutumn: formatValue(destination.recommendedSeason) === 'Otoño'
    });
});

router.get('/post/:id', renderDestinationDetail);

router.get('/post/:id/delete', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return renderNotice(
            res, 404, 'Destino no encontrado',
            'No existe ese destino.', '/', 'Volver al inicio'
        );
    }

    const destination = await board.deletePost(req.params.id);

    if (!destination) {
        return renderNotice(
            res, 404, 'Destino no encontrado',
            'No existe ese destino.', '/', 'Volver al inicio'
        );
    }

    if (destination.imageFilename) {
        await fs.rm(
            `${board.UPLOADS_FOLDER}/${destination.imageFilename}`,
            { force: true }
        );
    }

    return renderNotice(
        res, 200, 'Destino eliminado',
        'El destino se ha eliminado.', '/', 'Volver al inicio'
    );
});

router.get('/post/:id/image', async (req, res) => {
    const destination = await board.getPost(req.params.id);
    res.download(board.UPLOADS_FOLDER + '/' + destination.imageFilename);
});

const saveActivity = async (req, res) => {
    const isEditing = req.params.activityId !== undefined;
    let previousActivity = null;
    if (!ObjectId.isValid(req.params.id)) {
        return renderError(
            res, 404, 'Destino no encontrado',
            'No existe ese destino.', '/', 'Volver al inicio'
        );
    }

    const destination = await board.getPost(req.params.id);

    if (!destination) {
        return renderError(
            res, 404, 'Destino no encontrado',
            'No existe ese destino.', '/', 'Volver al inicio'
        );
    }

        if (isEditing) {
        if (ObjectId.isValid(req.params.activityId)) {
            previousActivity = await board.getActivity(
                req.params.id,
                req.params.activityId
            );
        }

        if (!previousActivity) {
            if (req.file) {
                await fs.rm(req.file.path, { force: true });
            }

            return renderError(
                res, 404, 'Actividad no encontrada',
                'No existe esa actividad en este destino.',
                `/destinations/${req.params.id}`, 'Volver al destino'
            );
        }
    }

    const activity = {
    _id: isEditing ? previousActivity._id : new ObjectId(),
    title: String(req.body['activity-title'] || '').trim(),
    description: String(req.body['activity-description'] || '').trim(),
    price: Number(req.body['activity-price']),
    category: String(req.body['element-category'] || ''),
    requiresBooking: req.body['activity-requires-booking'] === 'yes',
    imageFilename: req.file
        ? req.file.filename
        : previousActivity?.imageFilename || '',
    imageUrl: req.file
        ? `/uploads/${req.file.filename}`
        : previousActivity?.imageUrl || ''
};

const errors = [];

if (!activity.title) {
    errors.push('El título de la actividad es obligatorio.');
} else if (await board.activityTitleExists(
    req.params.id,
    activity.title,
    req.params.activityId
)) {
    errors.push('Ya existe una actividad con ese título en este destino.');
}

if (!activity.description) {
    errors.push('La descripción de la actividad es obligatoria.');
}

if (
    !String(req.body['activity-price'] || '').trim() ||
    !Number.isFinite(activity.price) ||
    activity.price < 0
) {
    errors.push('El precio debe ser un número mayor o igual que cero.');
}

const validCategories = ['adventure', 'culture', 'gastronomy', 'nature'];

if (!validCategories.includes(activity.category)) {
    errors.push('Selecciona una categoría válida.');
}

const bookingValue = req.body['activity-requires-booking'];

if (bookingValue !== 'yes' && bookingValue !== 'no') {
    errors.push('Indica si la actividad requiere reserva previa.');
}

if (!req.file && !isEditing) {
    errors.push('Selecciona una imagen.');
}

if (errors.length > 0) {
    if (req.file) {
        await fs.rm(req.file.path, { force: true });
    }

    return renderError(
        res,
        400,
        isEditing ? 'No se pudo actualizar la actividad' : 'No se pudo crear la actividad',
        errors.join(' '),
        `/destinations/${req.params.id}`,
        'Volver al destino'
    );
}

if (isEditing) {
    const result = await board.updateActivity(
        req.params.id,
        req.params.activityId,
        activity
    );

    if (result.matchedCount === 0) {
        if (req.file) {
            await fs.rm(req.file.path, { force: true });
        }

        return renderError(
            res, 404, 'Actividad no encontrada',
            'La actividad ya no está disponible.',
            `/destinations/${req.params.id}`, 'Volver al destino'
        );
    }

    if (req.file && previousActivity.imageFilename) {
        await fs.rm(
            `${board.UPLOADS_FOLDER}/${previousActivity.imageFilename}`,
            { force: true }
        );
    }
} else {
    await board.addActivity(req.params.id, activity);
}

return res.render('notice', {
    title: isEditing ? 'Actividad actualizada' : 'Actividad creada',
    message: isEditing
        ? 'Los cambios se han guardado correctamente.'
        : 'La actividad se ha añadido correctamente al destino.',
    actionUrl: `/destinations/${req.params.id}`,
    actionLabel: 'Volver al destino'
});
};

router.post('/destinations/:id/activities/new', upload.single('image'), saveActivity);
router.post('/destinations/:id/activities/:activityId/edit', upload.single('image'), saveActivity);

router.post('/destinations/:id/activities/:activityId/delete', async (req, res) => {
    const { id, activityId } = req.params;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(activityId)) {
        return renderError(
            res, 404, 'Actividad no encontrada',
            'Los identificadores no son válidos.',
            '/', 'Volver al inicio'
        );
    }

    const activity = await board.getActivity(id, activityId);

    if (!activity) {
        return renderError(
            res, 404, 'Actividad no encontrada',
            'No existe esa actividad en este destino.',
            '/', 'Volver al inicio'
        );
    }

    const result = await board.deleteActivity(id, activityId);

    if (result.modifiedCount === 0) {
        return renderError(
            res, 404, 'Actividad no encontrada',
            'La actividad ya no está disponible.',
            `/destinations/${id}`, 'Volver al destino'
        );
    }

    if (activity.imageFilename) {
        await fs.rm(
            `${board.UPLOADS_FOLDER}/${activity.imageFilename}`,
            { force: true }
        );
    }

    return res.render('notice', {
        title: 'Actividad eliminada',
        message: 'La actividad se ha eliminado correctamente.',
        actionUrl: `/destinations/${id}`,
        actionLabel: 'Volver al destino'
    });
});

router.get('/destinations/:id/activities/:activityId/edit', async (req, res) => {
    const { id, activityId } = req.params;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(activityId)) {
        return renderError(
            res, 404, 'Actividad no encontrada',
            'Los identificadores no son válidos.',
            '/', 'Volver al inicio'
        );
    }

    const activity = await board.getActivity(id, activityId);

    if (!activity) {
        return renderError(
            res, 404, 'Actividad no encontrada',
            'No existe esa actividad en este destino.',
            `/destinations/${id}`, 'Volver al destino'
        );
    }

    const category = formatValue(activity.category).toLocaleUpperCase('es');

    return res.render('edit_activity', {
        destination: { _id: id },
        activity,
        isAdventure: category === 'AVENTURA',
        isCulture: category === 'CULTURA',
        isGastronomy: category === 'GASTRONOMÍA',
        isNature: category === 'NATURALEZA'
    });
});