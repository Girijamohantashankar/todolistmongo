// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const app = express();
const port = process.env.port || 5000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://girijashankarmohanta11:Vo5xGaUvVAPr0WJ2@cluster0.9f3agqw.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const taskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("Task", taskSchema);
app.use(express.json());
app.use(cors());

app.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error querying tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/addTask", async (req, res) => {
  const { task } = req.body;
  if (task) {
    try {
      const newTask = new Task({ task });
      const savedTask = await newTask.save();
      res
        .status(200)
        .json({ message: "Task added successfully", taskId: savedTask._id });
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Task is required" });
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;
  if (mongoose.isValidObjectId(taskId)) {
    try {
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "Invalid Task ID" });
  }
});



// This part for serving the frontend part into the backend

app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"./frontend/build/index.html"),
    function(err){
        res.status(500).send(err)
    }
    )
})




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
