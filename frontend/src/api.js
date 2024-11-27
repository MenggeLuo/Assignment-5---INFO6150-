import axios from "axios";

const userApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const registerUser = (email, password) => {
    return userApi.post("/register", { email, password });
};

export const loginUser = (email, password) => {
    return userApi.post("/login", { email, password });
};

export const checkEmailExists = (email) => {
    return userApi.post("/check-email", { email });
};
