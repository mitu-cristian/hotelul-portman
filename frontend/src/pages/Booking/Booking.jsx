import "./booking.css"

// import images
import hotel_image from "../Home/images/hotel-image.jpg";

// import components
import Header from "../../components/Header/Header";
import BookingForm from "../../components/BookingForm/BookingForm";
import SingleRoomComponent from "../../components/RoomsComponents/SingleRoomComponent/SingleRoomComponent";
import DoubleRoomComponent from "../../components/RoomsComponents/DoubleRoomComponent/DoubleRoomComponent";
import TripleRoomComponent from "../../components/RoomsComponents/TripleRoomComponent/TripleRoomComponent";

import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the booking store

function Booking() {

  const {result} = useSelector((state) => state.booking)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
    <Header main = {true}/>

          {(result != null && Object.keys(result).length === 0) && <h1 className="message-booking">Pentru cerințele dvs. nu este nicio cameră disponibilă.</h1>}
          {/* {result == null && <div>Book now</div>} */}

          {(result && result.name == "SingleRoom") && <SingleRoomComponent/>}
          {(result && result.name == "DoubleRoom") && <DoubleRoomComponent/>}
          {(result && result.name == "TripleRoom") && <TripleRoomComponent/>}
        {/* </div> */}
      {/* </main> */}
    </>
  )
}

export default Booking
