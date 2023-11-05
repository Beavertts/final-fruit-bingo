var Express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const DATABASENAME = 'fruitbingoappdb';

var app = Express();
app.use(cors()); //to allow resource sharing. because both server and client runs on differnt ports/domain
const CONNECTION_STRING = "mongodb+srv://root:1IMKTQMoEjaiWGr7@cluster0.3e8phyf.mongodb.net/"

// Define a Mongoose schema for your collection
const fruitBingoAppSchema = new mongoose.Schema({
    id: String,
    image: String,
    whichImage: String
  });
  
  // Create a Mongoose model based on the schema
  const FruitBingoAppModel = mongoose.model('FruitBingoAppModel', fruitBingoAppSchema);
  
  mongoose
  .connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DATABASENAME,
  })
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(5038, () => {
      console.log('Server is running on port 5038');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

app.get("/fruitbingoapp/GetImages", async (request, response) => {
  try {
    // Use await to execute the query and retrieve all documents from the collection
    const result = await FruitBingoAppModel.find({});

    response.send(result);
  } catch (error) {
    console.error("Error fetching data from the collection:", error);
    response.status(500).send("Internal server error");
  }
});

