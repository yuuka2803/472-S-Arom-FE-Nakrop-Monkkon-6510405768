import axios from 'axios';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.headers["Content-type"] = "application/json";

export default axios;
// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API URL
// });

// // Request interceptor to add token
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export { axios, instance };