const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const createBlogRouter = require('./routes/BlogRoute')

require('dotenv').config()

const app = express()
//middleware
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {

    res.send('Blog is writting...');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xratx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //data base
        const database = client.db('LetsBlogDB')
        const blogCollections = database.collection('blogs');

        //Blog Routes
        app.use('/api', createBlogRouter(blogCollections));




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`)
})