import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('board');
const posts = db.collection('posts');

export const UPLOADS_FOLDER = './uploads';
export const DATA_IMAGES_FOLDER = './data/images';

export async function addPost(post) {

    return await posts.insertOne(post);
}

export async function deletePost(id){

    return await posts.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deletePosts(){

    return await posts.deleteMany();
}

export async function getPosts(){

    return await posts.find().toArray();
}

export async function countPosts(){

    return await posts.countDocuments();
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

export async function updatePost(id, changes) {
    return await posts.updateOne(
        { _id: new ObjectId(id) },
        { $set: changes }
    );
}

export async function addActivity(destinationId, activity) {
    return await posts.updateOne(
        { _id: new ObjectId(destinationId) },
        { $push: { activities: activity } }
    );
}

export async function activityTitleExists(destinationId, title) {
    const destination = await posts.findOne(
        {
            _id: new ObjectId(destinationId),
            'activities.title': title
        },
        {
            collation: { locale: 'es', strength: 2 }
        }
    );

    return destination !== null;
}
