import axios from "axios";

const API_URL = "/api/reservations/";

const getMyReservations = async () => {
    const response = await axios.get(API_URL, {withCredentials: true});
    if(response.data.success === true)
        return response.data.data;
    else return null;
}

const cancelMyReservation = async (reservationId) => {
    // console.log(reservationId)
    const response = await axios.put(API_URL + reservationId, {withCredentials: true})
    if(response.data.success === true)
        return response.data.data;
    else return response.data;
}

const reservationService = {
    getMyReservations, cancelMyReservation
}

export default reservationService;