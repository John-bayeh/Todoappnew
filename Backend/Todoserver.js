import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.get("/", (req, res) => res.send("Backend is running"));

// Use task routes
app.use("/tasks", taskRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
