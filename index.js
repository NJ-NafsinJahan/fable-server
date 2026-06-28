const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // main db
    const db = client.db("fableDB");

    // other db collections
    const writerCollection = db.collection("writers");
    const ebooksCollection = db.collection("ebooks");
    const bookingCollection = db.collection("bookings");
    const paymentCollection = db.collection("payments");
    const bookmarkCollection = db.collection("bookmarks");

    // ********

    //  Create Get API for writer
    app.get("/api/writer-profile/:email", async (req, res) => {
      const { email } = req.params;
      const result = await writerCollection.findOne({
        writerEmail: email,
      });
      res.send(result);
    });

    // POST API for writer-profile
    app.post("/api/writer-profile", async (req, res) => {
      try {
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
        console.log("Writer inserted successfully:", result);

        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error inside POST API:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // PATCH API for update writer-profile
    app.patch("/api/writer-profile/:id", async (req, res) => {
      try {
        // const { id } = req.params.id;
        const { id } = req.params;
        const { writerName, image, website, bio, writerEmail } = req.body;

        const updateData = {
          writerName,
          image,
          website,
          bio,
          writerEmail,
          createdAt: new Date(),
          status: "active",
        };

        const result = await writerCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: updateData,
          },
        );
        console.log("Writer inserted successfully:", result);

        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error inside POST API:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // *** api/ebooks routes

    // GET API for brows ebook
    app.get("/api/ebooks", async (req, res) => {
      const result = await ebooksCollection.find().toArray();
      console.log(result, "all ebooks");
      res.json(result);
    });

    // POST API for Add ebook
    app.post("/api/ebooks", async (req, res) => {
      try {
        const data = req.body;
        const result = await ebooksCollection.insertOne({
          ...data,
        });
        console.log("Book added successfully:", result);

        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error inside POST API:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // PATCH API for update ebook
    app.patch("/api/ebooks/:id", async (req, res) => {
      try {
        // const { id } = req.params.id;
        const { id } = req.params;
        const updateData = req.body;

        const result = await ebooksCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: updateData,
          },
        );
        console.log("book inserted successfully:", result);

        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error inside POST API:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });

    // DELETE API for delete ebook
    app.delete("/api/ebooks/:id", async (req, res) => {
      const { id } = req.params;
      const result = await ebooksCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //  Create Get API for ebook manage
    app.get("/api/ebooks/:email", async (req, res) => {
      const { email } = req.params;
      console.log(email);
      const result = await ebooksCollection
        .find({
          writerEmail: email,
        })
        .toArray();
      res.send(result);
    });

    // ! ******  Pinged  *******  Pinged    ******
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
