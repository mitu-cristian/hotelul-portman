import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import reservationService from "./reservationService";

const initialState = {
    reservations: null,
    isErrorRe: false,
    isSuccessRe: false,
    isLoadingRe: false,
    messageRe: ""
}

// See my reservations
export const getMyReservations = createAsyncThunk("reservation/getMyReservations", async (thunkAPI) => {
    try {
        return await reservationService.getMyReservations();
    }
    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

// Cancel my reservation
export const cancelMyReservation = createAsyncThunk("reservations/cancelMyReservation", async (reservationId, thunkAPI) => {
    try {
        return await reservationService.cancelMyReservation(reservationId);
    }
    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        resetRe: (state) => {
            state.isErrorRe = false;
            state.isSuccessRe = false;
            state.isLoadingRe = false;
            state.messageRe = ""
        }
    },
    extraReducers: (builder) => {
        builder
        
    // See my reservations
            .addCase(getMyReservations.pending, (state) => {
                state.isLoadingRe = true;
            })
            .addCase(getMyReservations.fulfilled, (state, action) => {
                state.isLoadingRe = false;
                state.reservations = action.payload;
            })

    // Cancel my reservation
            .addCase(cancelMyReservation.pending, (state) => {
                state.isLoadingRe = true;
            })
            .addCase(cancelMyReservation.fulfilled, (state, action) => {
                state.isLoadingRe = false;
                state.isSuccessRe = true;
                state.messageRe = "Rezervarea dvs. a fost ștearsă.";
                state.reservations = state.reservations.map((reservation) => {
                    if(reservation._id === action.payload)
                        return {...reservation, status: "canceled"}
                    else
                        return reservation;
                })
            })
            .addCase(cancelMyReservation.rejected, (state, action) => {
                state.isLoadingRe = false;
                state.isErrorRe = true;
                state.messageRe = "Ștergerea rezervării nu a putur fi procesată.";
            })
    }
})

export const {resetRe} = reservationSlice.actions;
export default reservationSlice.reducer;