import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer, Zoom} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import protect route
import PrivateRoute from "./hooks/PrivateRoute";

// Import components
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import BookingForm from "./components/BookingForm/BookingForm";
import hotel_image from "./pages/Home/images/hotel-image.jpg";

// Import pages
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Me from "./pages/Me/Me";
import Booking from "./pages/Booking/Booking";
import Rooms from "./pages/Rooms/Rooms";

function App() {
  return (
    <>
    <ToastContainer transition={Zoom} theme="colored" position="top-center"/>


    <Router>
    {/* <Header/>
      <main>
        <div className="container">
          <div className="hotel-image-container">
            <img className="hotel-image" src={hotel_image} alt="" />
          </div>
          <BookingForm/>
        </div>
        </main> */}

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/me" element={<PrivateRoute/>}>
        <Route path="/me" element={<Me/>}/>
      </Route>
      <Route path="/booking" element={<Booking/>}/>
      <Route path="/rooms" element={<Rooms/>}/>
    </Routes>

    </Router>
    
    <Footer/>
    </>
  );
}

export default App;
