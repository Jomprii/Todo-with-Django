import { useEffect, useState } from "react";
import profile from "./assets/jomps.jpg";
import { FaSearch } from "react-icons/fa";
import { PiSunDuotone, PiMoonDuotone } from "react-icons/pi";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getTasks, addTask, updateTask, deleteTask } from "./api/tasks.js";
import "./App.css";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);

  const openAddTask = () => setIsOpen(!isOpen);

  const toggleTheme = () => setIsLightMode((prev) => !prev);

  useEffect(() => {
    document.body.className = isLightMode ? "light-mode" : "dark-mode";
  }, [isLightMode]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleTaskChange = (e) => setTaskText(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      if (editId !== null) {
        const updatedTask = await updateTask(editId, { text: taskText });
        setTasks(
          tasks.map((task) =>
            task.id === editId ? { ...task, text: updatedTask.text } : task
          )
        );
        setEditId(null);
      } else {
        const newTask = await addTask({ text: taskText, completed: false });
        console.log("New Task:", newTask); // Debugging
        setTasks([...tasks, newTask]); // Add the new task to the state
        console.log("Updated Tasks:", tasks); // Debugging
      }
      setTaskText("");
      setIsOpen(false);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((task) => task.id === id);
    const updatedTask = await updateTask(id, {
      ...task,
      completed: !task.completed,
    });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: updatedTask.completed } : task
      )
    );
  };

  const deleteTaskHandler = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, text) => {
    setTaskText(text);
    setEditId(id);
    setIsOpen(true);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
    })
    .filter((task) => task.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`App ${isLightMode ? "light-mode" : "dark-mode"}`}>
      {/* HEADER */}
      <div className="header">
        <img src={profile} className="profile-pic" />
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Task"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="togglecontain" onClick={toggleTheme}>
          {isLightMode ? (
            <PiMoonDuotone
              size="34"
              title="Dark Mode"
              className="togglebutton"
            />
          ) : (
            <PiSunDuotone
              size="34"
              title="Light Mode"
              className="togglebutton"
            />
          )}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filterbuttons">
        <button id="filterbtn" onClick={() => setFilter("all")}>
          All
        </button>
        <button id="filterbtn" onClick={() => setFilter("pending")}>
          Pending
        </button>
        <button id="filterbtn" onClick={() => setFilter("completed")}>
          Completed
        </button>
      </div>

      {/* TASK LIST */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-item-container ${
              task.completed ? "completed" : ""
            }`}
          >
            <div className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="checkbox"
              />
              <span>{task.text}</span>
            </div>

            {/* TASK ACTIONS */}
            <div className="task-actions">
              <div
                className="edit-button"
                onClick={() => editTask(task.id, task.text)}
              >
                <FiEdit className="edit-btn" />
              </div>
              <div
                className="delete-button"
                onClick={() => deleteTaskHandler(task.id)}
              >
                <FiTrash2 className="delete-btn" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TASK BUTTON */}
      <div className="addtaskcontain" onClick={openAddTask}>
        <IoMdAdd className="addtask" size="34" />
      </div>

      {/* TASK WINDOW */}
      {isOpen && (
        <div className="addtaskwindow">
          <form onSubmit={handleSubmit} className="window-content">
            <input
              type="text"
              placeholder="Enter a task..."
              value={taskText}
              onChange={handleTaskChange}
              className="task-input"
            />
            <button type="submit" className="submit-task">
              {editId !== null ? "Update Task..." : "Add Task"}
            </button>
          </form>
          <IoMdClose className="close-button" onClick={openAddTask} />
        </div>
      )}
    </div>
  );
}
