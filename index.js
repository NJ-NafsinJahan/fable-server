const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    //! ***** database create
    const db = client.db("fableDB");
    const writerCollection = client.db("writers");
    const ebooksCollection = client.db("ebooks");
    const bookingCollection = client.db("bookings");
    const paymentCollection = client.db("payments");
    const bookmarkCollection = client.db("bookmarks");

    // ********
    // POST API for writer-profile
    app.post("/api/writer-profile", async (req, res) => {
      const { writerName, image, website, bio, writerEmail } = req.body;

      const addData = {
        writerName,
        image,
        website,
        bio,
        writerEmail,
        createdAt: new Date(),
        status: "active",
      };

      const result = await writerCollection.insertOne(addData);
      res.json(result);
    });

    // ! ******    *******      ******
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
