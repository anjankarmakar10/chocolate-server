const express = require("express");
const cors = require("cors");

const port = process.env.port || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://chocolate_admin:bCIUI5XtwhRp7xJj@cluster0.d2cwisz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const chocolateCollaction = client
      .db("chocolateDB")
      .collection("chocolateCollaction");

    app.get("/chocolates", async (req, res) => {
      const cursor = chocolateCollaction.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/chocolates", async (req, res) => {
      const chocolate = req.body;
      const result = await chocolateCollaction.insertOne(chocolate);
      res.send(result);
    });

    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollaction.deleteOne(query);

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error.message);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
