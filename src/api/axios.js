import axios from "axios";
import { baseURL } from "../Utility/baseURL";

const axiosSecure = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${
      localStorage.getItem("userDetails") &&
      JSON.parse(localStorage.getItem("userDetails")).token
    }`,
  },
});

const axiosOpen = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const makeRequest = () => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("userDetails") &&
        JSON.parse(localStorage.getItem("userDetails")).token
      }`,
    },
  });
};

export { axiosSecure, axiosOpen, makeRequest };
