import {useEffect} from "react";
import {toast} from "react-toastify";

// import components
import SeeMyReservationsItem from "./SeeMyReservationsItem/SeeMyReservationsItem";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the reservation store
import {getMyReservations, resetRe} from "../features/reservation/reservationSlice";

function SeeMyReservations() {

    const {reservations, isErrorRe, isSuccessRe, isLoadingRe, messageRe} = useSelector((state) => state.reservation)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyReservations());
        dispatch(resetRe());
        }, [])

    useEffect(() => {
      if(isErrorRe)
        toast.error(messageRe);
      dispatch(resetRe)
    }, [dispatch, isErrorRe])

    if(isLoadingRe) 
        return <div>Loading ...</div>
  return (
    <>
        {reservations && reservations.map((reservation) => (<SeeMyReservationsItem key={reservation._id} reservation = {reservation} />))}
    </>
  )
}

export default SeeMyReservations
