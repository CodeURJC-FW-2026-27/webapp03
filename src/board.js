import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('board');
const posts = db.collection('posts');

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

export async function addPost(post) {

    return await posts.insertOne(post);
}

export async function deletePost(id){

    return await posts.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deletePosts(){

    return await posts.deleteMany();
}

export async function getPosts(page, limit, search = '', priceRange = '') {

    const cursor = posts.find(buildSearchFilter(search, priceRange));
    if (Number.isInteger(page) && Number.isInteger(limit)) {
        cursor.skip((page - 1) * limit).limit(limit);
    }

    return await cursor.toArray();
}

export async function countPosts(search = '', priceRange = '') {

    return await posts.countDocuments(buildSearchFilter(search, priceRange));
}

export async function getPostByName(name) {

    return await posts.findOne(
        { name },
        { collation: { locale: 'es', strength: 2 } }
    );
}

export async function getPost(id){

    return await posts.findOne({ _id: new ObjectId(id) });
}

