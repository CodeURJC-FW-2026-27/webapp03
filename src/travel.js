import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('supertrip');
const destinationsCollection = db.collection('destinations');

export const UPLOADS_FOLDER = './uploads';
export const DATA_IMAGES_FOLDER = './data/images';

const priceRangePatterns = {
    economical: /^(?:economical|económico)$/i,
    medium: /^(?:medium|medio)$/i,
    high: /^(?:high|alto)$/i,
    luxury: /^(?:luxury|lujo)$/i
};

const buildSearchFilter = (search, priceRange) => {
    const filter = {};

    if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.name = { $regex: escapedSearch, $options: 'i' };
    }

    if (priceRangePatterns[priceRange]) {
        filter.priceRange = priceRangePatterns[priceRange];
    }

    return filter;
};

export async function addDestination(destination) {
    return await destinationsCollection.insertOne(destination);
}

export async function deleteDestination(id) {
    return await destinationsCollection.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteDestinations() {
    return await destinationsCollection.deleteMany();
}

export async function getDestinations(page, limit, search = '', priceRange = '') {
    const cursor = destinationsCollection.find(buildSearchFilter(search, priceRange));
    if (Number.isInteger(page) && Number.isInteger(limit)) {
        cursor.skip((page - 1) * limit).limit(limit);
    }

    return await cursor.toArray();
}

export async function countDestinations(search = '', priceRange = '') {
    return await destinationsCollection.countDocuments(buildSearchFilter(search, priceRange));
}

export async function getDestinationByName(name) {
    return await destinationsCollection.findOne(
        { name },
        { collation: { locale: 'es', strength: 2 } }
    );
}

export async function getDestination(id) {
    return await destinationsCollection.findOne({ _id: new ObjectId(id) });
}

export async function updateDestination(id, changes) {
    return await destinationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: changes }
    );
}

export async function addActivity(destinationId, activity) {
    return await destinationsCollection.updateOne(
        { _id: new ObjectId(destinationId) },
        { $push: { activities: activity } }
    );
}

export async function activityTitleExists(destinationId, title, excludedId) {
    const activityFilter = { title };

    if (excludedId) {
        activityFilter._id = { $ne: new ObjectId(excludedId) };
    }

    const destination = await destinationsCollection.findOne(
        {
            _id: new ObjectId(destinationId),
            activities: { $elemMatch: activityFilter }
        },
        {
            collation: { locale: 'es', strength: 2 }
        }
    );

    return destination !== null;
}

export async function ensureActivityIds() {
    const destinations = await destinationsCollection.find({
        activities: { $elemMatch: { _id: { $exists: false } } }
    }).toArray();

    for (const destination of destinations) {
        for (const activity of destination.activities) {
            if (!activity._id) {
                activity._id = new ObjectId();
            }
        }

        await updateDestination(destination._id.toString(), {
            activities: destination.activities
        });
    }
}

export async function deleteActivity(destinationId, activityId) {
    return await destinationsCollection.updateOne(
        { _id: new ObjectId(destinationId) },
        {
            $pull: {
                activities: { _id: new ObjectId(activityId) }
            }
        }
    );
}

export async function getActivity(destinationId, activityId) {
    const destination = await getDestination(destinationId);

    if (!destination) {
        return null;
    }

    return destination.activities.find(
        activity => activity._id.toString() === activityId
    ) || null;
}

export async function updateActivity(destinationId, activityId, changes) {
    const fields = {};

    for (const field in changes) {
        fields[`activities.$.${field}`] = changes[field];
    }

    return await destinationsCollection.updateOne(
        {
            _id: new ObjectId(destinationId),
            'activities._id': new ObjectId(activityId)
        },
        { $set: fields }
    );
}
