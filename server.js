const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/reminders", (req, res) => {
  const db = readDB();
  res.json(db.reminders);
});

app.post("/api/reminders", (req, res) => {
  const db = readDB();
  const newReminder = { id: Date.now(), ...req.body };
  db.reminders.push(newReminder);
  writeDB(db);
  res.json(newReminder);
});

app.put("/api/reminders/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.reminders.findIndex(r => r.id === id);
  if (index === -1) return res.sendStatus(404);
  db.reminders[index] = { ...db.reminders[index], ...req.body };
  writeDB(db);
  res.json(db.reminders[index]);
});

app.delete("/api/reminders/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.reminders = db.reminders.filter(r => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
