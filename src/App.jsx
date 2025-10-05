import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

export default function App() {
  const [taskname, setTaskname] = useState("");
  const [taskdescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("None");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/tasks";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskname.trim() || !taskdescription.trim()) return;

    const newTask = {
      name: taskname,
      description: taskdescription,
      dueDate,
      priority,
      completed: false,
    };

    try {
      if (editId) {
        const res = await axios.put(`${API_URL}/${editId}`, newTask);
        setTasks(tasks.map((t) => (t._id === editId ? res.data : t)));
        setEditId(null);
      } else {
        const res = await axios.post(API_URL, newTask);
        setTasks((prev) => [...prev, res.data]);
      }

      setTaskname("");
      setTaskDescription("");
      setDueDate("");
      setPriority("Low");
    } catch (err) {
      console.error("Error adding/updating task:", err);
    }
  }

  const handleComplete = async (id) => {
    try {
      const task = tasks.find((t) => t._id === id);
      const res = await axios.put(`${API_URL}/${id}`, {
        ...task,
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (task) => {
    setTaskname(task.name);
    setTaskDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setEditId(task._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Incompleted") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "Priority") {
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.priority] - order[a.priority];
    }
    if (sort === "Due Date") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white px-4 py-6 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="floating-ball"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 10}s`,
            background: `radial-gradient(circle, rgba(255,255,255,0.8), transparent)`
          }}
        ></div>
      ))}

      <header className="text-center mb-6 relative z-10">
        <h1 className="text-3xl font-bold text-purple-300 drop-shadow-lg">
          To-Do List
        </h1>
      </header>

      <div className="flex flex-row gap-5 justify-center mb-6 relative z-10">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-black border border-purple-400 rounded px-3 py-2 focus:outline-none"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Incompleted">Incompleted</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-black border border-purple-400 rounded px-3 py-2 focus:outline-none"
        >
          <option value="None">Sort By</option>
          <option value="Priority">Priority</option>
          <option value="Due Date">Due Date</option>
        </select>
      </div>

      <div className="bg-black/40 border border-purple-500 shadow-xl rounded-lg p-6 max-w-xl mx-auto relative z-10">
        <h2 className="text-xl font-bold text-center mb-4 text-purple-300">
          {editId ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <input
            value={taskname}
            onChange={(e) => setTaskname(e.target.value)}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Task Name"
          />
          <textarea
            value={taskdescription}
            placeholder="Task Description"
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
          <label className="font-bold text-purple-300">Due Date</label>
          <input
            type="date"
            value={dueDate}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setDueDate(e.target.value)}
          />
          <label className="font-bold text-purple-300">Priority</label>
          <select
            value={priority}
            className="border border-purple-500 bg-black/50 text-white text-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            disabled={!taskname.trim() || !taskdescription.trim()}
            className={`bg-gradient-to-r from-pink-400 to-purple-700 py-2 rounded-lg w-1/2 mx-auto transition ${
              !taskname.trim() || !taskdescription.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80"
            }`}
          >
            {editId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

      <div className="mt-6 max-w-xl mx-auto relative z-10">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks found.</p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`border border-purple-500 p-4 rounded-lg mb-3 shadow-lg ${
                task.completed ? "bg-green-900/40" : "bg-black/40"
              }`}
            >
              <h3 className="font-bold text-purple-300">{task.name}</h3>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
              <p
                className={`text-sm font-semibold ${
                  task.priority === "High"
                    ? "text-red-400"
                    : task.priority === "Medium"
                    ? "text-yellow-300"
                    : "text-green-300"
                }`}
              >
                Priority: {task.priority}
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleComplete(task._id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
