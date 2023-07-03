import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import reviewReducer from "../features/review/reviewSlice";
import reservationReducer from "../features/reservation/reservationSlice";
import bookingReducer from "../features/booking/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userMe: userReducer,
    review: reviewReducer,
    reservation: reservationReducer,
    booking: bookingReducer
  },
});
