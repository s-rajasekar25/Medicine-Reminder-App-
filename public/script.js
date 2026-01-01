const API = "http://localhost:3000/api/reminders";
let reminders = [];

async function fetchReminders() {
  const res = await fetch(API);
  reminders = await res.json();
  displayReminders();
}

function displayReminders() {
  const table = document.getElementById("reminderTable");
  table.innerHTML = "";

  reminders.forEach((r, index) => {
    table.innerHTML += `
      <tr>
        <td>${r.medicine}</td>
        <td>${r.dosage}</td>
        <td>${r.time}</td>
        <td>${r.date}</td>
        <td>${r.repeat}</td>
        <td><span class="status ${r.status === "Active" ? "active" : "taken"}">${r.status}</span></td>
        <td>
          <button class="edit" onclick="editReminder(${r.id})">Edit</button>
          <button class="delete" onclick="deleteReminder(${r.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

async function saveReminder() {
  const reminder = {
    medicine: medicine.value,
    dosage: dosage.value,
    time: time.value,
    date: date.value,
    repeat: repeat.value,
    notes: notes.value,
    status: "Active"
  };

  if (editIndex.value === "") {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminder)
    });
  } else {
    await fetch(`${API}/${editIndex.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminder)
    });
    editIndex.value = "";
  }

  fetchReminders();
}

function editReminder(id) {
  const r = reminders.find(r => r.id === id);
  medicine.value = r.medicine;
  dosage.value = r.dosage;
  time.value = r.time;
  date.value = r.date;
  repeat.value = r.repeat;
  notes.value = r.notes;
  editIndex.value = id;
}

async function deleteReminder(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchReminders();
}

fetchReminders();
