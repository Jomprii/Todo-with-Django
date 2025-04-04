import axios from "axios";

const API_BASE_URL = "https://django-backend-svk0.onrender.com/tasks/";

export const getTasks = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post(API_BASE_URL, task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axios.put(`${API_BASE_URL}${id}/`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_BASE_URL}${id}/`);
};
