import axios from "axios";
import { baseURL } from "../Utility/baseURL";

const axiosSecure = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`
  }
});

const axiosOpen = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});



export { axiosSecure, axiosOpen };