const express = require("express");
const app = express();
const morgan = require('morgan')
app.use(express.json());
app.use(morgan('tiny'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  const serverTime = new Date();
  const html = `Phonebook has info for ${persons.length} people <br/><br/> ${serverTime}`;
  res.send(html);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const exists = persons.filter(
    (storedPerson) => storedPerson.name === person.name
  );

  if (exists.length > 0) {
    return res.status(400).json({
      error: "name exists",
    });
  }

  const largeRandomValue = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  person.id = String(largeRandomValue);

  persons = persons.concat(person);
  res.send(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
  console.log(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
