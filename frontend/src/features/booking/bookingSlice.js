import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import bookingService from "./bookingService";

const adults = JSON.parse(localStorage.getItem("adults"));
const children = JSON.parse(localStorage.getItem("children"));
const startDate = JSON.parse(localStorage.getItem("startDate"));
const endDate = JSON.parse(localStorage.getItem("endDate"));

const initialState = {
    form: (adults != null && children != null && startDate != null && endDate != null) ? {
        "adults": adults,
        "children": children,
        "start": startDate,
        "end": endDate
    } : null,
    isLoadingFo: false,
    isSuccessFo: false,
    result: null,
    rooms: null,
    messageFo: ""
}

// Check user criteria
export const checkUserCriteria = createAsyncThunk("booking/checkUserCriteria", async(userData, thunkAPI) => {
    try {
        return await bookingService.checkUserCriteria(userData);
    }
    catch (error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Get a single room
export const getSingleRoom = createAsyncThunk("booking/getSingleRoom", async(roomId, thunkAPI) => {
    try {
        return await bookingService.getSingleRoom(roomId)
    }
    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Add reservation
export const addReservation = createAsyncThunk("/booking/addReservation", async(userData, thunkAPI) => {
    console.log(userData)
    try {
        return await bookingService.addReservation(userData);
    }
    catch(error) {
        const message = error.response.data.error || (error.response && error.resposne.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

export const bookingSlice = createSlice({
    name: "booking",
    initialState, 
    reducers: {
        resetFo: (state) => {
            state.isLoadingFo = false;
            state.isSuccessFo = false;
            state.messageFo = "";
        },
        resetFoResult: (state) => {
            state.result = null;
        }
    },
    extraReducers: (builder) => {
        builder
// Check user criteria
            .addCase(checkUserCriteria.pending, (state) => {
                state.isLoadingFo = true;
            })
            .addCase(checkUserCriteria.fulfilled, (state, action) => {
                state.isSuccessFo = true;
                state.isLoadingFo = false;
                state.result = action.payload;
            })

// Get single room
            .addCase(getSingleRoom.pending, (state) => {
                state.isLoadingFo = true;
            })
            .addCase(getSingleRoom.fulfilled, (state, action) => {
                state.isSuccessFo = true;
                state.isLoadingFo = false;
                state.rooms = action.payload;
            })

// Add reservation
            .addCase(addReservation.fulfilled, (state) => {
                state.isSuccessFo = true;
                state.messageFo = "Rezervarea a fost procesată."
            })
    }
})

export const {resetFo, resetFoResult} = bookingSlice.actions;
export default bookingSlice.reducer;