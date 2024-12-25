const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const createBlogRouter = require('./routes/BlogRoute')
const createCommentRouter = require('./routes/CommentRoute')
const createWishlistRouter = require('./routes/WishListRoute')
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');

require('dotenv').config()

const app = express()
//middleware
app.use(cors({
    origin: ['http://localhost:5173',
        'https://blog-app-d54d1.web.app',
        'https://console.firebase.google.com/project/blog-app-d54d1/overview',
        'https://blog-app-d54d1.firebaseapp.com'
    ],
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser())


//verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    //verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).send('Access denied. Invalid token.');
        }
        req.user = decode;
        next();
    })


}

app.get('/', (req, res) => {

    res.send('Blog is writting...');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xratx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        //data base
        const database = client.db('LetsBlogDB')
        const blogCollections = database.collection('blogs');
        const commentCollections = database.collection('comments');
        const wishlistCollections = database.collection('wishlists');

        //jwt authentication
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: '1h',
            })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                })
                .send({ success: true });
        })

        //logout
        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
                })
                .send({ success: true })
        })
        //creating index for enabling search
        await blogCollections.createIndex({ title: "text", description: "text" });
        //Blog Routes
        app.use('/api', createBlogRouter(blogCollections));

        //Comment Routes
        app.use('/api', createCommentRouter(commentCollections));

        //Wishlist Routes
        app.use('/api', createWishlistRouter(wishlistCollections, blogCollections, verifyToken));




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`)
})