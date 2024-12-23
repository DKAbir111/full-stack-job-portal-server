const express = require('express')

const router = express.Router()

const createWishlistRouter = (wishlistCollections) => {
    //create a new wishlist
    router.post('/wishlist', async (req, res) => {
        const newWishlist = req.body;
        const result = await wishlistCollections.insertOne(newWishlist);
        res.status(201).send(result);
    })
    //get all wishlists

    //get a single wishlist by id

    //update a wishlist by id

    //delete a wishlist by id

    return router;
}

module.exports = createWishlistRouter;