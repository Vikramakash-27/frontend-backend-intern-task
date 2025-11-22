// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // ✅ 1) AUTH GUARD: if no token, go to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ 2) Fetch user profile
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/users/me"); // GET /api/users/me
        setUser(res.data);
      } catch (err) {
        console.error("ME FETCH ERROR:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    fetchMe();
  }, [navigate]);

  // ✅ Helper: load tasks from backend
  async function loadTasks() {
    try {
      const res = await api.get("/tasks"); // GET /api/tasks
      setTasks(res.data);
    } catch (err) {
      console.error("TASK FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ 3) Fetch tasks when page loads
  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ Logout
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // ✅ 4) Create task, then reload from backend
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      await api.post("/tasks", formData); // POST /api/tasks
      setFormData({ title: "", description: "" });
      // 👉 re-fetch tasks so UI always matches DB
      await loadTasks();
    } catch (err) {
      console.error("TASK CREATE ERROR:", err);
      setError("Could not create task.");
    } finally {
      setCreating(false);
    }
  }

  // ✅ 5) Delete task (we can still update state locally)
  async function handleDelete(id) {
    try {
      await api.delete(`/tasks/${id}`); // DELETE /api/tasks/:id
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("TASK DELETE ERROR:", err);
    }
  }

  // ✅ Filter tasks based on search
  const filteredTasks = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Header with user + Logout */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Your Tasks</h1>
            {user && (
              <p className="text-sm text-gray-500">
                Welcome, <span className="font-medium">{user.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded text-sm font-medium border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full border rounded px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Create a new task</h2>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              name="title"
              className="w-full border rounded px-3 py-2 text-sm"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 rounded bg-slate-900 text-white text-sm font-medium disabled:opacity-70"
          >
            {creating ? "Creating..." : "Add Task"}
          </button>
        </form>

        {/* Task list */}
        {loading && <p>Loading...</p>}

        {!loading && filteredTasks.length === 0 && (
          <p className="text-gray-500">
            {tasks.length === 0
              ? "No tasks yet — create one!"
              : "No tasks match your search."}
          </p>
        )}

        <ul className="mt-4 space-y-4">
          {filteredTasks.map((t) => (
            <li
              key={t._id}
              className="p-4 shadow border rounded flex items-start justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold">{t.title}</h2>
                <p className="text-gray-500">{t.description}</p>
              </div>

              <button
                onClick={() => handleDelete(t._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
