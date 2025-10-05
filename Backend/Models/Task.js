import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: String },
  priority: { type: String, default: "Low" },
  completed: { type: Boolean, default: false }
});

export default mongoose.model("Task", taskSchema);
