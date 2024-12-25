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
        const { q, category } = req.query;
        let query = {};
        if (q) {
            query = {
                $text: { $search: q }
            };
        }
        if (category && category !== "All") {
            query.category = category;
        }

        const result = await BlogCollections.find(query).toArray();

        res.send(result);
    })

    //get a single blog by id
    router.get('/blog/:id', async (req, res) => {
        const id = new ObjectId(req.params.id);
        const result = await BlogCollections.findOne({ _id: id });
        if (result) res.send(result);
        else res.status(404).send('Not Found');
    })

    //fetch 6 latest bog for banner
    router.get('/latest-blogs', async (req, res) => {
        try {
            const result = await BlogCollections.find()
                .sort({ createdAt: -1 })
                .limit(6)
                .toArray();

            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching blogs', error });
        }
    });

    //top post based on word count
    router.get('/top-posts', async (req, res) => {
        const blogs = await BlogCollections.find().toArray();

        const blogsWithWordCount = blogs.map(blog => ({
            ...blog,
            wordCount: blog.longDescription.split(' ').length,
        }));


        const topPosts = blogsWithWordCount
            .sort((a, b) => b.wordCount - a.wordCount)
            .slice(0, 10);

        res.send(topPosts);
    });



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