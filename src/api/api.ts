import axios from "axios";

//could be set in env if not localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_CONTEXT_AWARE_AI_API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
