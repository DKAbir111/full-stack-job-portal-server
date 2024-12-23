const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()

const createBlogRouter = (BlogCollections) => {

    //add a new blog
    router.post('/blog', async (req, res) => {
        const newBlog = req.body;
        const result = await BlogCollections.insertOne(newBlog);
        res.status(201).send(result);
    })

    //get all blogs
    router.get('/blogs', async (req, res) => {
        const result = await BlogCollections.find().toArray();
        res.send(result);
    })

    //get a single blog by id
    router.get('/blog/:id', async (req, res) => {
        const id = new ObjectId(req.params.id);
        const result = await BlogCollections.findOne({ _id: id });
        if (result) res.send(result);
        else res.status(404).send('Not Found');
    })

    //update a blog by id
    router.put('/blog/:id', async (req, res) => {
        const id = new ObjectId(req.params.id);
        const updatedBlog = req.body;
        const result = await BlogCollections.updateOne({ _id: id }, { $set: updatedBlog });
        res.send(result);
    })

    //delete a blog by id
    return router;
}

module.exports = createBlogRouter;