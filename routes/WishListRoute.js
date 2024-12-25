const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router()

const createWishlistRouter = (wishlistCollections, blogCollections, verifyToken) => {
    //create a new wishlist
    router.post('/wishlist', async (req, res) => {
        const { email, blogId } = req.body;
        const isExist = await wishlistCollections.findOne({ email, blogId })
        if (isExist) {
            return res.status(409).send({ message: "Wishlist item already exists." });
        }
        const newWishlist = { email, blogId };
        const result = await wishlistCollections.insertOne(newWishlist);
        res.status(201).send(result);
    })

    //get data from wishlistCollection
    router.get('/wishlist', verifyToken, async (req, res) => {
        email = req.query.email;
        if (req.user?.email != req.query?.email) {
            return res.status(401).send('Access denied. Invalid user.');
        }
        const wishLists = await wishlistCollections.find({ email }).toArray();
        const blog = await Promise.all(
            wishLists.map(async wishList => {
                const query = { _id: new ObjectId(wishList.blogId) }
                const result = await blogCollections.findOne(query)
                result.wishId = wishList._id
                return result;
            })
        )
        res.send(blog);

    })


    //remove wishlist from wishlistCollection
    router.delete('/wishlist/:id', verifyToken, async (req, res) => {
        const id = req.params.id;
        if (req.user?.email != req.body?.email) {
            return res.status(401).send('Access denied. Invalid user.');
        }
        const query = { _id: new ObjectId(id) }
        const result = await wishlistCollections.deleteOne(query);
        res.send(result);
    })

    return router;
}

module.exports = createWishlistRouter;