import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
});

export const getMetrics = async () => {
  const response = await API.get("/metrics");
  return response.data;
};