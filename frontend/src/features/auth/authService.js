import axios from "axios";

const API_URL = "/api/users/";

// Register
const register = async (userData) => {
    const response = await axios.post(API_URL + "register", userData)
    if(response.data.success === true)
        localStorage.setItem("user", JSON.stringify(response.data.data))
    return response.data.data;
}

// Login
const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData)
    if(response.data.success === true)
        localStorage.setItem("user", JSON.stringify(response.data.data))
    return response.data.data;
}

// Logout
const logout = async () => {
    const response = await axios.get(API_URL + "logout", {withCredentials: true});
    if(response.data.success === true) {
        localStorage.removeItem("user");
        localStorage.removeItem("adults");
        localStorage.removeItem("children");
        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");
    }
    return response.data;
}

// Delete the account
const deleteAcc = async () => {
    const response = await axios.delete(API_URL, {withCredentials: true});
    return response.data;
}

const authService = {
    register, login, logout, deleteAcc
}
export default authService;