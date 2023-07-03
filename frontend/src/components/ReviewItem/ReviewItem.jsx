import "./reviewItem.css"

import {useState, useEffect} from "react";
import {toast} from "react-toastify"; 

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the user store
import {updateReview, reset} from "../../features/review/reviewSlice";
import {getMyReview} from "../../features/user/userSlice";

function ReviewItem({review, user}) {
  
// Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    return formattedDate;
  }
  const createdAt = formatDate(review.createdAt);
  let updatedAt = formatDate(review.updatedAt);
  
// Updating the review
  const {isLoading, isError, isSuccess, message} = useSelector((state) => state.review)

  const dispatch = useDispatch();

  useEffect(() => {
    if(isError)
      toast.error(message);
    else if(isSuccess) {
// Change existing review
      // const divTitle = document.getElementById("review-title");
      // divTitle.textContent = title;
      // // const divRating = document.getElementById("rating");
      // // divRating.textContent = rating;
      // const divDescription = document.getElementById("review-description");
      // divDescription.textContent = description;
      // updatedAt = formatDate(new Date())
      dispatch(getMyReview())
      toast.success("Recenzia dvs. a fost actualizată.");
    }
    dispatch(reset())
  }, [isError, isSuccess, message, reset])

  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");

  const editReview = () => {
    setEdit(!edit);
    setTitle(review.title);
    setDescription(review.description);
    setRating(review.rating);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {title, description, rating};
    dispatch(updateReview(userData))
    setEdit(!edit);
    }
    

  // Disable submit button functionality

  const input_review_title = document.getElementById("review-title");
  const input_review_description = document.getElementById("review-description");

  function checkValidity_update_user_review() {
    if (input_review_title && input_review_description) {
      if(input_review_title.checkValidity() && input_review_description.checkValidity() && title.length !== 0 &&
      description.length !== 0) { return true; }
    }
    else return false;
  }




  return (
    <>
    {user && <button className="button-86 me-page" onClick = {editReview}> {edit ? "Anulează" : "Editează recenzia" } </button>}

    {edit &&
    <>
    <form onSubmit = {onSubmit}>
      <fieldset>

      <div className="formInput-me">
      <div className="input-me">
        <section className="input-content-me">
          <div className="input-content-wrap-me">
            <dl className="inputbox-me">
              <dd className="inputbox-content-me">
              <input type="text" id="review-title" value={title} onChange = {(e) => setTitle(e.target.value)} required />
                <div className="underline-me"></div>
                <label >Titlu</label></dd></dl></div></section></div></div>

        <div id="radio-button-text">Nota</div>
        <ul className="rating">
          <li>
            <input type="radio" id="num1" value="1" checked={rating === 1} onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num1">1</label>
          </li>
          <li>
            <input type="radio" id="num2" value="2" checked = {rating === 2} onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num2">2</label>
          </li>
          <li>
            <input type="radio" id="num3" value="3" checked = {rating === 3} onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num3">3</label>
          </li>
          <li>
            <input type="radio" id="num4" value="4" checked = {rating === 4} onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num4">4</label>
          </li>
          <li>
            <input type="radio" id="num5" value="5" checked = {rating === 5} onChange = {(e) => setRating(+e.target.value)} />
            <label htmlFor="num5">5</label>
          </li>
        </ul>
        
        <textarea name="description" id="review-description" value={description} cols="30" rows="10" onChange = {(e) => setDescription(e.target.value)}>
          
        </textarea>
      </fieldset>
    <button disabled = {checkValidity_update_user_review() === true ? false : true} className="button-86 me-page">Actualizează</button>
    
    </form> 
    </>
    }
    
    <div className="my-review-container">
    <section className="my-review">

      <div className="review-header">

        <div className="left-panel">
          <div className="rating">
            <div> {review.rating} </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
          </div>

          <div className="user">
            {!user && <div>{review.user.firstname} {review.user.lastname}</div>}
          </div>
        </div>

        <div className="when">
          <div id="created-at"><span>Postat</span> {createdAt}</div>
          {createdAt !== updatedAt && <div id="updated-at"><span>Actualizat</span> {updatedAt}</div> }
        </div>

      </div>

      <div className="title"> {review.title} </div>
      <div className="description"> {review.description} </div>
    </section>

    <br></br>
    </div>
    </>
  )
  }

export default ReviewItem
