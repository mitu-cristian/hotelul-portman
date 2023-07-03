// import style
import "./review.css";

// import components
import ReviewItem from "./ReviewItem/ReviewItem";

import {useEffect} from "react";

// Redux general
import {useSelector, useDispatch} from "react-redux";

// Redux for the review store
import {avgRating, getReviews, reset} from "../features/review/reviewSlice";

function Review() {

    const{avg, reviews, isError, isLoading, isSuccess, message, rating} = useSelector((state) => state.review);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(avgRating());
        dispatch(getReviews({
          rating: rating,
          page: 1
        }))
    }, [])

    if(!reviews)
        return <div>Loading...</div>

  return (
    <>
      {/* <div id="note-clientilor">
        Nota clienților: {avg}/5
      </div> */}
      {reviews.data.map((review) => (<ReviewItem key={review._id} review = {review} user={false}/>))}
      {reviews.count === 0 && <h1>Nu există nicio recenzie pentru opțiunea selectată.</h1>}
    </>
  )
}

export default Review
