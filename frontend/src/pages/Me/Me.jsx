import "./me.css";
import "./input.css";

// import images
import hotel_image from "../Home/images/hotel-image.jpg";

import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom"; 

// import components
import ReviewItem from "../../components/ReviewItem/ReviewItem"
import SeeMyReservations from "../../components/SeeMyReservations";
import Header from "../../components/Header/Header";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the auth store
import {deleteAcc, reset} from "../../features/auth/authSlice";

// Redux for the user store
import {getMe, getMyReview, deleteMyReview, checkReview, addMyReview, updateMe, updatePass, resetMe} from "../../features/user/userSlice";

function Me() {
  const {userMe, reviewMe, checkReviewMe, isLoadingMe, isErrorMe, isSuccessMe, isSuccessMeAddReview, messageMe} = useSelector((state) => state.userMe)
  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const navigate = useNavigate();

// For changing the info for the user
  useEffect(() => {
    if(messageMe && isErrorMe) 
      toast.error(messageMe);
    else if(messageMe && isSuccessMe)
      toast.success(messageMe);
    else if(isSuccessMeAddReview) {
      toast.success(messageMe);
      dispatch(getMyReview());
    }

      dispatch(resetMe())
  }, [messageMe, isErrorMe, isSuccessMe, dispatch]);


// Populating the form 
  useEffect(() => {
    if(userMe) {
      setFirstname(userMe.firstname);
      setLastname(userMe.lastname);
      setEmail(userMe.email);
    }
  }, [userMe])
  
// Update user information 
  const [updateUserInfo, setUpdateUserInfo] = useState(false)
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const updateUserInfoClick = () => {
    dispatch(getMe());
    setUpdateUserInfo(!updateUserInfo);
  }

  const onSubmitInfo = (e) => {
    e.preventDefault();
    const userData = {firstname, lastname, email}
    dispatch(updateMe(userData))
    setUpdateUserInfo(!updateUserInfo)
  }

// Update user password  
  const [updateUserPass, setUpdateUserPass] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onSubmitPass = (e) => {
    e.preventDefault();

    const userData = {currentPassword, newPassword};
    dispatch(updatePass(userData));

// Reset the form
    setCurrentPassword("");
    setNewPassword("");

// Collapsing the form
    setUpdateUserPass(!updateUserPass);
  }


// Delete the account
  const deleteAccount = () => {
    dispatch(deleteAcc());
  }

  useEffect(() => {
    if(isError)
      toast.error(message)
    
    else if(isSuccess) {
      console.log("I am here.")
      toast.success(message)
      localStorage.removeItem("user");
      navigate("/")
    }

    dispatch(reset())
  },[isError, isSuccess, navigate, dispatch])

// Displaying the review
  useEffect(() => {
    dispatch(getMyReview())
    dispatch(checkReview())
  }, [])

//Delete the review
const buttonDeleteMyReview = () => {
  dispatch(deleteMyReview());
}

// Add the review
const [addReview, setAddReview] = useState(false)
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [rating, setRating] = useState("")

const onSubmitReview = (e) => {
  e.preventDefault();
  const userData = {title, description, rating};
  dispatch(addMyReview(userData));
  setAddReview(!addReview);
  setTitle("");
  setDescription("");
  setRating("");
}





// -----------------   New style ------------------



// --------------------- Update user info --------------------
const input_firstname = document.getElementById("firstname");
const input_lastname = document.getElementById("lastname");
const input_email = document.getElementById("email");

function checkValidity_update_user_info() {
  if(input_firstname && input_lastname && input_email) {
    if(input_firstname.checkValidity() && input_lastname.checkValidity() && input_email.checkValidity() &&
      firstname !== "" && lastname !== "" && email!=="")
      { return true; }
  }
  else
    return false;
}


// ---------------------- update password --------------------
const input_current_password = document.getElementById("current-password");
const input_new_password = document.getElementById("new-password");

const lowerCase = /[a-z]/.test(newPassword);
const upperCase = /[A-Z]/.test(newPassword);
const number = /\d/.test(newPassword);
const specialCharacter = /[!@#$%^&*(),.?\":{}|<>`~;/\[\]]/.test(newPassword);
const length = newPassword.length > 7;

function checkValidity_update_user_password() {
  if (input_current_password && input_new_password) {
    if(input_current_password.checkValidity() && input_new_password.checkValidity() && lowerCase && upperCase
      && specialCharacter && length) { return true; }
  }
  else return false;
}



// ======================= add review ===============================
const input_add_review_title = document.getElementById("add-review-title");
const input_add_review_description = document.getElementById("add-review-description");

function checkValidity_add_user_review() {
  if (input_add_review_title && input_add_review_description) {
    if(input_add_review_title.checkValidity() && input_add_review_description.checkValidity() && title.length !== 0 &&
    description.length !== 0 && (rating === 1 || rating === 2 || rating === 3 || rating === 4 || rating === 5)) { return true; }
  }
  else return false;
}

// Displaying the loading component
  if(isLoadingMe)
    return <div>Loading...</div>

  return (
  <>
  <Header main = {false}/>

  <div className="container">

    <h1 id="contul-meu">Contul meu</h1>

    {updateUserInfo &&
    <>
    <div className="container update-user-info">
      <h1>Informațiile contului sunt: </h1>
        <form onSubmit={onSubmitInfo}>
          <fieldset disabled = {!updateUserInfo}>

          <div className="formInput-me">
            <div className="input-me">
              <section className="input-content-me">
                <div className="input-content-wrap-me">
                  <dl className="inputbox-me">
                    <dd className="inputbox-content-me">
                    <input type="text" pattern="^^[A-Za-z ]+$" id="firstname" name="firstname" value={firstname} placeholder="Enter your firstname." onChange={(e) => setFirstname(e.target.value)} required />
                      <div className="underline-me"></div>
                      <label >Prenume</label>
                    </dd>
                  </dl>
                </div>
              </section>
            </div>
        </div>

        
        <div className="formInput-me">
            <div className="input-me">
              <section className="input-content-me">
                <div className="input-content-wrap-me">
                  <dl className="inputbox-me">
                    <dd className="inputbox-content-me">
                    <input type="text" pattern="^^[A-Za-z ]+$" id="lastname" name="lastname" value={lastname} placeholder="Enter your last name." onChange={(e) => setLastname(e.target.value)} required/>
                      <label >Nume de familie</label>
                    </dd>
                  </dl>
                </div>
              </section>
            </div>
        </div>

        <div className="formInput-me">
            <div className="input-me">
              <section className="input-content-me">
                <div className="input-content-wrap-me">
                  <dl className="inputbox-me">
                    <dd className="inputbox-content-me">
                    <input type="email" id="email" name="email" value={email} placeholder="Enter your email address." onChange={(e) => setEmail(e.target.value)} required/>
                      <label >Email</label>
                    </dd>
                  </dl>
                </div>
              </section>
            </div>
        </div>
            {/* <input type="text" pattern="^^[A-Za-z ]+$" id="firstname" name="firstname" value={firstname} placeholder="Enter your firstname." onChange={(e) => setFirstname(e.target.value)} required />
            <input type="text" pattern="^^[A-Za-z ]+$" id="lastname" name="lastname" value={lastname} placeholder="Enter your last name." onChange={(e) => setLastname(e.target.value)} required/>
            <input type="email" id="email" name="email" value={email} placeholder="Enter your email address." onChange={(e) => setEmail(e.target.value)} required/> */}
            {updateUserInfo && <button disabled = {checkValidity_update_user_info() === true ? false : true} className="button-86 me-page" type="submit">Actualizează</button>}
          </fieldset>
        </form>
      </div>
      </>}

    <div className="container">
      <button className="button-86 me-page" onClick = {updateUserInfoClick}> {updateUserInfo ? "Anulează" : "Actualizează informațiile"} </button>
    </div>




{/* ===================== password ========================== */}



    {updateUserPass &&
    <>
    <div className="container update-user-password">
    <h1>Schimbă parola</h1>
    <form onSubmit = {onSubmitPass}>
      <fieldset disabled = {!updateUserPass}>

      <div className="formInput-me">
      <div className="input-me">
        <section className="input-content-me">
          <div className="input-content-wrap-me">
            <dl className="inputbox-me">
              <dd className="inputbox-content-me">
              <input type="password" id="current-password" name="curret-password" value={currentPassword} required onChange={(e) => setCurrentPassword(e.target.value)}/>
                <div className="underline-me"></div>
                <label >Parola actuală</label></dd></dl></div></section></div></div>


      <div className="formInput-me">
        <div className="input-me">
          <section className="input-content-me">
            <div className="input-content-wrap-me">
              <dl className="inputbox-me">
                <dd className="inputbox-content-me">
                  <input type="password" id="new-password" name="new-password" value={newPassword} required onChange={(e) => setNewPassword(e.target.value)}/>
                  <div className="underline-me"></div>
                  <label >Parola nouă</label>
                </dd>
              </dl>
            </div>
          </section>
        </div>

      <div className={lowerCase ? 'info checked' : 'info'}>O literă mică.</div>
      <div className={upperCase ? 'info checked' : 'info'}>O literă mare.</div>
      <div className={number ? 'info checked' : 'info'}>Un număr.</div>
      <div className={specialCharacter ? 'info checked' : 'info'}>Un caracter special.</div>
      <div className={length ? 'info checked' : 'info'}>Lungime de cel puțin 8 caractere.</div>

      </div>


          {/* <input type="password" id="current-password" name="curret-password" value={currentPassword} placeholder="Enter your current password." onChange={(e) => setCurrentPassword(e.target.value)}/>
          <input type="password" id="new-password" name="new-password" value={newPassword} placeholder="Enter your new password." onChange={(e) => setNewPassword(e.target.value)}/> */}
          {updateUserPass && <button disabled = {checkValidity_update_user_password() === true ? false : true} className="button-86 me-page" type="submit">Actualizează</button>}
      </fieldset>
    </form>
    </div>
    </>}

    <div className="container">
      <button className="button-86 me-page" onClick = {() => setUpdateUserPass(!updateUserPass)}> {updateUserPass ? "Anulează" : "Actualizează parola" } </button>
      <button className="button-86 me-page" onClick = {deleteAccount}>Șterge contul</button>
    </div>

{/* =================  review  =========================*/}
      {reviewMe ? 
      
        <>
        <div className="container see-review">
          <ReviewItem key = {reviewMe._id} review = {reviewMe} user={true}/> 
          <button className="button-86 me-page" onClick = {buttonDeleteMyReview}>Șterge rezenzia</button>
        </div>
        </>
        
        : 
      
        <>
          <div className="container no-review">
            <h1 >Nu ai nicio recenzie</h1>
            <button disabled = {!checkReviewMe} className="button-86 me-page" id="addReviewButton" onClick = {() => setAddReview(!addReview)}> 
            {addReview ? "Anulează" : "Adaugă o recenzie"}</button>
          </div> 
        </>
      }
      {addReview && 
      <>
        <form onSubmit = {onSubmitReview}>
      <fieldset>
        {/* <input type="text" value={title} onChange = {(e) => setTitle(e.target.value)} /> */}
        
        <div className="formInput-me">
      <div className="input-me">
        <section className="input-content-me">
          <div className="input-content-wrap-me">
            <dl className="inputbox-me">
              <dd className="inputbox-content-me">
              <input type="text" id="add-review-title" value={title} onChange = {(e) => setTitle(e.target.value)} />
                <div className="underline-me"></div>
                <label >Titlu</label></dd></dl></div></section></div></div>

        <div id="radio-button-text">Nota</div>

        <ul className="rating">
          <li>
            <input type="radio" id="num1" value="1" onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num1">1</label>
          </li>
          <li>
            <input type="radio" id="num2" value="2" onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num2">2</label>
          </li>
          <li>
            <input type="radio" id="num3" value="3" onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num3">3</label>
          </li>
          <li>
            <input type="radio" id="num4" value="4" onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num4">4</label>
          </li>
          <li>
            <input type="radio" id="num5" value="5" onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num5">5</label>
          </li>
        </ul>
        
        <textarea name="description" id="add-review-description" value={description} placeholder="Descriere" cols="30" rows="10" onChange = {(e) => setDescription(e.target.value)}>
          
        </textarea>

        {/* <input type="text" value={description} onChange = {(e) => setDescription(e.target.value)} /> */}
      </fieldset>
    <button  disabled = {checkValidity_add_user_review() === true ? false : true} className="button-86 me-page">Adaugă recenzia</button>
    </form> 
    </>  
      }

    <div className="container">
      <SeeMyReservations/>
    </div>

  </div>
  </>
  )
}

export default Me
