const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router()

const createWishlistRouter = (wishlistCollections, blogCollections) => {
    //create a new wishlist
    router.post('/wishlist', async (req, res) => {
        const { email, blogId } = req.body;
        const isExist = await wishlistCollections.findOne({ email, blogId })
        if (isExist) {
            return res.status(409).send({ message: "Wishlist item already exists." });
        }
        const result = await wishlistCollections.insertOne(newWishlist);
        res.status(201).send(result);
    })

    router.get('/wishlist', async (req, res) => {
        email = req.query.email;
        const wishLists = await wishlistCollections.find({ email }).toArray();
        const blog = await Promise.all(
            wishLists.map(async wishList => {
                const query = { _id: new ObjectId(wishList.blogId) }
                const result = await blogCollections.findOne(query)
                return result;
            })
        )
        res.send(blog);

    })

    return router;
}

module.exports = createWishlistRouter;