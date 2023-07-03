import "./bookingForm.css"
import "./button-86.css"

// Calendar
import {DateRange} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {format} from "date-fns";

// React general
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux from booking store
import {resetFo, resetFoResult, checkUserCriteria} from "../../features/booking/bookingSlice";
function BookingForm() {

    // For the calendar
    const [openDate, setOpenDate] = useState(false)
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const [adultOption, setAdultOption] = useState(1);
    const [childOption, setChildOption] = useState(0);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const {form, isLoadingFo, isSuccessFo} = useSelector((state) => state.booking) 

    // useEffect(() => {
    //     if (form != null) {
    //         setAdultOption(form.adults);
    //         setChildOption(form.children);
    //         setDate((prevDate) => [{
    //             ...prevDate[0],
    //             startDate: new Date(form.start),
    //             endDate: new Date(form.end)
    //         }])
    //     }
    // }, [])

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("adults")) !== null && JSON.parse(localStorage.getItem("children")) !== null
        && JSON.parse(localStorage.getItem("endDate")) && JSON.parse(localStorage.getItem("startDate")) !== null) {
            setAdultOption(JSON.parse(localStorage.getItem("adults")));
            setChildOption(JSON.parse(localStorage.getItem("children")));
            setDate((prevDate) => [{
                ...prevDate[0],
                startDate: new Date(JSON.parse(localStorage.getItem("startDate"))),
                endDate: new Date(JSON.parse(localStorage.getItem("endDate")))
            }])
        }
    }, [])


    useEffect(() => {
        if(isSuccessFo) {
            localStorage.setItem("adults", JSON.stringify(adultOption));
            localStorage.setItem("children", JSON.stringify(childOption));
            localStorage.setItem("startDate", JSON.stringify(date[0].startDate));
            localStorage.setItem("endDate", JSON.stringify(date[0].endDate));
            navigate("/booking")
        }
        dispatch(resetFo())
    },[isSuccessFo, resetFo])

    const bookingFunction = (e) => {
        e.preventDefault();
        const userData = {
            "adults": adultOption, 
            "children": childOption, 
            "start": date[0].startDate.toLocaleString('en-US'), 
            "end": date[0].endDate.toLocaleString('en-US')
        }
        dispatch(checkUserCriteria(userData))
    }

    const toggleDropdown = () => {
        var dropdownMenu = document.getElementById("dropdown-menu");
        if(dropdownMenu)
            dropdownMenu.style.display = (dropdownMenu.style.display === "none" ? "block" : "none");
      }

      const toggleDropdown2 = () => {
        var dropdownMenuChild = document.getElementById("dropdown-menu-child");
        if(dropdownMenuChild)
            dropdownMenuChild.style.display = (dropdownMenuChild.style.display === "none" ? "block" : "none");
      }
    
    const selectOption = (option) => {

        setAdultOption(+option.target.textContent);
        // console.log(typeof(+option.target.textContent)) for useState

// Access the id of that element
        const htmlString = option.target.outerHTML;
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        const elementId = tempElement.firstChild.id;
        const extractedString = elementId.slice(0, -1);
        const number = parseInt(elementId.match(/\d+/)[0]);

// toggle the checked class
        const dropdownItem = document.getElementById(elementId);
            if(dropdownItem.className === `dropdown-item ${extractedString} checked`) {
                // dropdownItem.classList.remove('checked');
            }
            else {
                dropdownItem.classList.add('checked');
                if (extractedString === "adult") {
                    if (number === 1) {
                        const otherElement = document.getElementById(`${extractedString}2`);
                        otherElement.classList.remove("checked");
                    }
                    else if (number === 2) {
                        const otherElement = document.getElementById(`${extractedString}1`);
                        otherElement.classList.remove("checked");                        
                    }
                }
            }

    // toggle drop down menu
        var dropdownMenu = document.getElementById("dropdown-menu");
            dropdownMenu.style.display = "block";
      }


      const selectOption2 = (option) => {

        setChildOption(+option.target.textContent);
        // console.log(typeof(+option.target.textContent)) for useState

// Access the id of that element
        const htmlString = option.target.outerHTML;
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        const elementId = tempElement.firstChild.id;
        const extractedString = elementId.slice(0, -1);
        const number = parseInt(elementId.match(/\d+/)[0]);

// toggle the checked class
        const dropdownItem = document.getElementById(elementId);
            if(dropdownItem.className === `dropdown-item ${extractedString} checked`) {

                // dropdownItem.classList.remove('checked');
            }
            else {
                dropdownItem.classList.add('checked');
                if (extractedString === "child") {
                    if (number === 0) {
                        const otherElement = document.getElementById(`${extractedString}1`);
                        otherElement.classList.remove("checked");
                    }
                    else if (number === 1) {
                        const otherElement = document.getElementById(`${extractedString}0`);
                        otherElement.classList.remove("checked");                        
                    }
                }
            }

    // toggle drop down menu
        var dropdownMenu = document.getElementById("dropdown-menu-child");
            dropdownMenu.style.display = "block";
      }
      
  return (
    <div className="container">
        <div className="booking-form">
            <p className="greeting">Fă o rezervare</p>
            <div className="vertical-line"></div>

            <div className="booking-box calendar">

                 <div className="text">
                    <p className="description">Check in & Check out</p>
                    <svg onClick = {() => setOpenDate(!openDate)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                </div>

                <p className="chosen-option">{`${format(date[0].startDate, "dd.MM.yyyy")}`} - {`${format(date[0].endDate, "dd.MM.yyyy")}`}</p>
                {openDate && <DateRange editableDateInputs={true} onChange = {item => setDate([item.selection])} 
                moveRangeOnFirstSelection = {false} ranges = {date} className="calendar-item"/>}

            </div>

            <div className="booking-box" onClick= {() => toggleDropdown()} >
                
                <div className="text">
                    <p className="description">Nr. de adulți</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                </div>

                <p class="chosen-option"> {adultOption === 1 ? "1 adult" : "2 adulți"} </p>
                
                <div id="dropdown" className="dropdown">
                    <div id="dropdown-menu" style= {{display: 'none'}}>
                        <div className={`dropdown-item adult ${adultOption === 1 ? "checked" : ""}`} id="adult1" onClick= {(e) => selectOption(e)}>1</div>
                        <div className={`dropdown-item adult ${adultOption === 2 ? "checked" : ""}`} id="adult2" onClick= {(e) => selectOption(e)}>2</div>
                    </div>
                </div>
            </div>

            <div className="booking-box" onClick= {() => toggleDropdown2()} >
                
                <div className="text">
                    <p className="description">Nr. de copii</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                </div>

                <p class="chosen-option"> {childOption === 0 ? "niciun copil" : "1 copil"} </p>
                
                <div id="dropdown" className="dropdown">
                    <div id="dropdown-menu-child" style= {{display: 'none'}}>
                        <div className={`dropdown-item child ${childOption === 0 ? "checked" : ""}`} id="child0" onClick= {(e) => selectOption2(e)}>0</div>
                        <div className={`dropdown-item child ${childOption === 1 ? "checked" : ""}`} id="child1" onClick= {(e) => selectOption2(e)}>1</div>
                    </div>
                </div>
            </div>

            <button className="button-86" onClick = {bookingFunction} >Caută</button>

        </div>
    </div>
  )
}

export default BookingForm
