import axios from "axios";

const API_URL = "/api/users/";
const API_URL_REVIEWS = "/api/reviews/"

const getMe = async() => {
    const response = await axios.get(API_URL,  {withCredentials: true});
    return response.data.data;
}

const updateMe = async(userData) => {
    const response = await axios.put(API_URL, userData, {withCredentials: true});
    return response.data;
}

const updatePass = async(userData) => {
    const response = await axios.put(API_URL + "updatePassword", userData, {withCredentials: true});
    return response.data;
}

const getMyReview = async () => {
    const response = await axios.get(API_URL_REVIEWS);
    if(response.data.success === true)
        return response.data.data;
    else return null;
}

const deleteMyReview = async () => {
    const response = await axios.delete(API_URL_REVIEWS, {withCredentials: true});
    if(response.data.success === true)
        return response.data.message;
    else return response.data;
}

const addMyReview = async (userData) => {
    const response = await axios.post(API_URL_REVIEWS, userData, {withCredentials: true});
    if(response.data.success === true)
        return response.data.message;
    else return response.data;
}

const checkReview = async () => {
    const response = await axios.get(API_URL_REVIEWS + "check", {withCredentials: true});
    if(response.data.success === true)
        return response.data.addReview;
}

const userService = {
    getMe, updateMe, updatePass, getMyReview, deleteMyReview, addMyReview, checkReview
}

export default userService;