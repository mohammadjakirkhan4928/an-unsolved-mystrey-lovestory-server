const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const port = process.env.PORT || 9000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uri =
  "mongodb+srv://mdjakirkhan4928:JHyTHdpkHUatlH95@ebook.ddq4ksp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

if (uri) {
  console.log("mongodb connected");
}

async function run() {
  try {
    await client.connect(); // establish connection to MongoDB Atlas cluster
    reviewCollection = client.db("ebook").collection("review");

    app.get("/", async (req, res) => {
      res.send("e-book server is running");
    });

    // handle POST requests to /review
    app.post("/review", async (req, res) => {
        try {
          console.log("Request body:", req.body);

          const { name, message } = req.body; // get the name and message fields from the request body

          // insert the new review document into the "review" collection in the database
          const result = await reviewCollection.insertOne({ name, message });

          // return the inserted document as the response
          console.log("Inserted document:", result.ops[0]);
          res.status(201).json(result.ops[0]);
        } catch (err) {
          console.error("Error handling POST /review request:", err);
          res.status(500).json({ error: "Internal server error" });
        }
      });

    app.get("/reviewGet", async (req, res) => {
      try {
        const reviews = await reviewCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        res.status(200).json(reviews);
      } catch (err) {
        console.error("Error handling GET /reviewGet request:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas cluster:", err);
  }
}

run();
