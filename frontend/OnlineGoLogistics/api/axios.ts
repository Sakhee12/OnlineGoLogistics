import axios from "axios";
import { Platform } from "react-native";

export const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.1.30:5001"
      : "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});
