import "./header.css";
import logo from "./images/logo.png";

import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {logout, reset} from "../../features/auth/authSlice";
import {toast} from "react-toastify";

import BookingForm from "../BookingForm/BookingForm";
import hotel_image from "../../pages/Home/images/hotel-image.jpg";

function Header({main}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, message, isError, isSuccess, isLoading} = useSelector((state) => state.auth)

  

  useEffect(() => {
    if(isError) 
    toast.error(message);
    
    if(!user && isSuccess ) {
      toast.success("Deconectat.");
      navigate("/")
    }

    if(user && isSuccess)
      toast.success("Autentificat.");

    dispatch(reset())
  }, [isError, isSuccess, message, navigate, dispatch])

  const onLogout = () => {
    dispatch(logout());
  }

  return (
  <>
  <nav>
    <div className="container">
        <div className="logo">
            <img className="logo-image" src={logo}/>
            <Link to="/">Hotelul Portman</Link>
        </div>
        <div className="nav-buttons">

        <ul className="header">
            {user ? (
            <>
              <p>Bună, {user.firstname}!</p>
              <button id="button" onClick={onLogout}>Deconectare</button>
            </>
            ) : 
            <>  
              <li>
                <Link to="/login">Autentificare</Link>
              </li>
              <li>
                <Link to="/register">Înregistrare</Link>
              </li>
            </>}
        </ul>

        <ul className="nav">
            <li>
                <Link to="/rooms">Camere</Link>
            </li>
            <li>
                <Link to="/booking">Rezervare</Link>
            </li>
            {/* <li>
                <Link to="#">Contact</Link>
            </li> */}

            {
              user && (<li> <Link className="my-account" to="/me">Contul meu</Link> </li>)
            }
        </ul>

        </div>
    </div>
</nav>
{main === true && <main>
        <div className="container">
          <div className="hotel-image-container">
            <img className="hotel-image" src={hotel_image} alt="" />
          </div>
          <BookingForm/>
        </div>
        </main>} 
  </>
  )
}

export default Header
