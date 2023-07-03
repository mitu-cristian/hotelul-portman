import "./seeMyReservations.css";

import {useEffect} from "react";
import {toast} from "react-toastify";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the reservation store
import {cancelMyReservation, resetRe} from "../../features/reservation/reservationSlice";

function SeeMyReservationsItem({reservation}) {

    const {isSuccessRe, isErrorRe, messageRe} = useSelector((state) => state.reservation)
    const dispatch = useDispatch();

// Format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    return formattedDate;
  }

  const buttonCancelMyReservation = (reservationId) => {
    dispatch(cancelMyReservation(reservationId))
    console.log("reservationId ", reservationId)
    // const encoder = new TextEncoder();
    // const encodedString = encoder.encode(reservationId)
    // const byteSize = encodedString.byteLength;
    // console.log(byteSize)
  }

  return (
    <section key={reservation._id} className="see-my-reservations">

        <div >
            Preț: {reservation.price} 
        </div>

        <div>
            Adulți: {reservation.adults}
        </div>

        <div>
            Copii: {reservation.children}
        </div>

        <div>
            Numărul camerei: {reservation.roomNumber}
        </div>

        <div>
            Check in: {formatDate(reservation.startDate)}
        </div>

        <div>
            Check out: {formatDate(reservation.endDate)}
        </div>

        <div>
            Status: {reservation.status === "completed" && "efectuat"}{reservation.status === "new" && "inițiat"} {reservation.status === "canceled" && "anulat"}
        </div>

        <button className="button-86 me-page" disabled={reservation.status === "completed" || reservation.status === "canceled"} onClick = {() => dispatch(cancelMyReservation(reservation._id))}>Anulează rezervarea</button>

        <br></br>
    </section>
  )
}

export default SeeMyReservationsItem
