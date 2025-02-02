require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
const Entries = require("./models/entry");

// morgan
morgan.token("data", function (req, res) {
  console.log(req.body);
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

// persons array
// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/info", (req, res) => {
  const serverTime = new Date();
  const html = `Phonebook has info for ${persons.length} people <br/><br/> ${serverTime}`;
  res.send(html);
});

app.get("/api/persons", (req, res) => {
  Entries.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Entries.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }

  const entry = new Entries({
    name: body.name,
    number: body.number || false,
  });

  entry.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
  console.log(persons);
});

// connecting app to port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
