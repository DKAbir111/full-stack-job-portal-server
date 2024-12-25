const express = require('express')

const router = express.Router()

const createCommentRouter = (commentCollections) => {
    //create a new comment
    router.post('/comment', async (req, res) => {
        const newComment = req.body;
        const result = await commentCollections.insertOne(newComment);
        res.status(201).send(result);
    })

    //get all comments
    router.get('/comment', async (req, res) => {
        const result = await commentCollections.find().toArray();
        res.send(result);
    })

    //get comment by blog id
    router.get('/comment/:blogId', async (req, res) => {
        const blogId = req.params.blogId;
        const result = await commentCollections.find({ blogId }).toArray();
        res.send(result);
    })

    // Fetch 3 random comments
    router.get('/comments/random', async (req, res) => {
        try {
            const randomComments = await commentCollections.aggregate([
                { $sample: { size: 3 } }
            ]).toArray();
            res.send(randomComments);
        } catch (error) {
            res.status(500).send({ message: "Error fetching random comments", error });
        }

    });
    //delete a comment by id
    router.delete('/comment/:id', async (req, res) => {
        const id = req.params.id;
        const result = await commentCollections.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).send('Not Found');
        res.send(result);
    })

    //update a comment by id

    return router;
}


module.exports = createCommentRouter;