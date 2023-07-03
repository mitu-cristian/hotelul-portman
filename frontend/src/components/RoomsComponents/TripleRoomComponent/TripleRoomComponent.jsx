import "./tripleRoomComponent.css"
import triple_room from "../images/TripleRoom.jpg";

import {useState} from "react";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux from booking store
import {getSingleRoom} from "../../../features/booking/bookingSlice";

// Import component
import Reserve from "../../Reserve/Reserve";

function TripleRoomComponent() {

  const {isLoadingFo} = useSelector((state) => state.booking)
  const {form, result} = useSelector((state) => state.booking)

  const dispatch = useDispatch();

  let nightsNo;

  const startDateLS = JSON.parse(localStorage.getItem("startDate"))
  const endDateLS = JSON.parse(localStorage.getItem("endDate")) 

  const startDate = new Date(startDateLS);
  const endDate = new Date(endDateLS);
  nightsNo = (endDate.getTime() - startDate.getTime())/(1000*60*60*24);

  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    dispatch(getSingleRoom(result.roomId))
    setOpenModal(!openModal)
  }

  if(isLoadingFo)
    return <div>Loading...</div>

  return (
    <div className="box-room">
    <img src={triple_room} alt="" />
    <h2>Cameră dublă + 1</h2>
    <div>Număr de nopți: {nightsNo}</div>
    <div>Preț: {result.price}</div>
    <button className="button-86" onClick={handleClick}>
      {openModal === false ? "Rezervă" : "Anulează"}
    </button>
    {openModal && <Reserve setOpen = {setOpenModal} roomId = {result.roomId}/>}
  </div>
  )
}

export default TripleRoomComponent
