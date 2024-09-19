const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["in-progress", "done"] },
  // assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  assignedTo: { type: String, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
