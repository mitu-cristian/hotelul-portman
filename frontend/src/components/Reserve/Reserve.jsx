import "./reserve.css";
import {toast} from "react-toastify";

// React general
import {useState, useEffect} from "react";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux from booking store
import {resetFo, getSingleRoom, addReservation} from "../../features/booking/bookingSlice";

function Reserve({setOpen, roomId}) {
    
    const {form, rooms, isLoadingFo, isSuccessFo, messageFo} = useSelector((state) => state.booking)
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    const [selectedRooms, setSelectedRooms] = useState([])

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime())
        let list = [];

        while(date <= end) {
            list.push(new Date(date).getTime())
            date.setDate(date.getDate()+1)
        }
        return list;
    }

    const startDateLS = JSON.parse(localStorage.getItem("startDate"));
    const endDateLS = JSON.parse(localStorage.getItem("endDate"));

    const allDates = getDatesInRange(startDateLS, endDateLS)
    
    const isAvailable = (roomNumber) => {
        const unavailableDatesModified = []
        for(let i = 0; i < roomNumber.unavailableDates.length; i = i + 1)
        unavailableDatesModified.push(new Date(roomNumber.unavailableDates[i]).getTime() )

        // console.log("allDatesLength", allDates.length)
        // console.log("unavailableMofidiedLength", unavailableDatesModified.length)

        let available = true;
        let k = 0;
        while (k < allDates.length && available === true) {
            let j = 0;
            while (j < unavailableDatesModified.length && available === true) {
                // console.log(`allDates k = ${k}`, allDates[k])
                // console.log(`unavailableDates j = ${j}`, unavailableDatesModified[j])
                if(allDates[k] === unavailableDatesModified[j]) {
                    available = false
                    // console.log("available din interiorul if-ului", available)
                }
                // console.log("Rezultatul este: ", available)
                // console.log("")
                j = j + 1;
            }
            k = k + 1;
        }
        return available;  
    }


    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter(item => item !== value)) 
    }

    const handleClick = async () => {
            await Promise.all(selectedRooms.map((roomId) => {
               const userData = {
                    roomId, "form" : {
                        "adults": JSON.parse(localStorage.getItem("adults")),
                        "children": JSON.parse(localStorage.getItem("children")),
                        "start": JSON.parse(localStorage.getItem("startDate")),
                        "end": JSON.parse(localStorage.getItem("endDate"))
                    }
                }
                // console.log(userData)
                setOpen(false);
                dispatch(addReservation(userData))
                toast.success("Rezervarea a fost procesată.")
            }))
        
    }

    const checkValidity = () => {
        if(selectedRooms.length > 0)
            return true;
        else
            return false;
    }

    if(isLoadingFo)
        return <div>Loading...</div>

  return (
    <div className="reserve">
        <div className="rContainer">
            {/* <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)}/> */}
            <span>Alege numărul camerei</span>
        </div>
        {rooms.roomNumbers.map(roomNumber => (
            <div className="room" key={roomNumber._id}>
                <label> {roomNumber.number} </label>
                <input type="checkbox" id="checkbox" value={roomNumber._id} onChange={handleSelect} 
                disabled={!isAvailable(roomNumber)}
                />
            </div>
        ))}
        {user && <button disabled = {checkValidity() === true ? false : true} className="button-86" onClick={handleClick}>Rezervă</button>}
        {!user && <p>Doar utilizatorii care s-au înregistrat pot rezerva online un sejur.</p>}
    </div>
  )
}

export default Reserve
