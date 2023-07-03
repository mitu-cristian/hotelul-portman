import axios from "axios";

const API_URL = "/api/"

const checkUserCriteria = async (userData) => {
    const response = await axios.post(API_URL + "reservations/booking/checkUserCriteria", userData);
    if(response.data.success === true) {
        return response.data.data;
    }
    else return null;
}

const getSingleRoom = async(roomId) => {
    const response = await axios.get(API_URL + "rooms/" + roomId);
    if(response.data.success === true )
        return response.data.data;
    else 
        return null;
}

const addReservation = async(userData) => {
    // console.log(roomNumberId)
    console.log(userData)
    const response = await axios.post(API_URL + "rooms/" + userData.roomId + "/reservations", userData.form, {withCredential: true})
    if(response.data.success === true)
        return response.data.data;
    else
        return null;
}

const bookingService = {
    checkUserCriteria, getSingleRoom, addReservation
};

export default bookingService;