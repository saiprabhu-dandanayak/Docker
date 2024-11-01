const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    id: 1,
    name: "saiprabhu",
    email: "saiprabhu@gmail.com",
    age: 23,
    address: "Adilabad",
  },
  {
    id: 2,
    name: "Madhu",
    email: "madhu@gmail.com.com",
    age: 23,
    address: "Khalilabad",
  },
  {
    id: 3,
    name: "Shivam",
    email: "shivam@gmail.com.com",
    age: 23,
    address: "patna",
  },
  {
    id: 4,
    name: "varaprasad",
    email: "vara@gmail.com.com",
    age: 23,
    address: "Prathipadu",
  }
];

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json(newUser);
});

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
  });