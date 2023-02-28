const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

// app
const app = express();

// connect to db
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// schema
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// middleware
app.use(cors());
app.use(express.json());

// handle POST requests to "/api/contacts"
app.post("/api/contacts", async (req, res) => {
  const { email, name, phone } = req.body;

  if (!email || !name || !phone) {
    res.status(400).send("Email, name, and phone are required");
    return;
  }

  const contactData = { email, name, phone };

  try {
    await Contact.create(contactData);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// handle GET requests to "/"
app.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving contacts from database");
  }
});

// port
const port = process.env.PORT || 4000;

// listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
