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
    router.get('/comments', async (req, res) => {
        const result = await commentCollections.find().toArray();
        res.send(result);
    })

    //get a single comment by id
    router.get('/comment/:id', async (req, res) => {
        const id = new ObjectId(req.params.id);
        const result = await commentCollections.findOne({ _id: id });
        if (result) res.send(result);
        else res.status(404).send('Not Found');
    })

    //update a comment by id
    router.put('/comment/:id', async (req, res) => {
        const id = new ObjectId(req.params.id);
        const updatedComment = req.body;
        const result = await commentCollections.updateOne({ _id: id }, { $set: updatedComment });
        res.send(result);
    })

    return router;
}


module.exports = createCommentRouter;