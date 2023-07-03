import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import reviewService from "./reviewService";

const rating = JSON.parse(localStorage.getItem("rating"));

const initialState = {
    avg: null,
    reviews: null,
    isError: false,
    isSuccess: false,
    isSuccessReviewPagination: false,
    // isLoading: false,
    message: "",
    rating: rating ? rating : "all"
}

// Average rating
export const avgRating = createAsyncThunk("review/avgRating", async(thunkAPI) => {
    try {
        return await reviewService.avgRating();
    }

    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// See reviews
export const getReviews = createAsyncThunk("review/getReviews", async(userData, thunkAPI) => {
    try {
        return await reviewService.getReviews(userData);
    }

    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Update review
export const updateReview = createAsyncThunk("review/update", async (userData, thunkAPI) => {
    try {
        return await reviewService.updateReview(userData);
    }
    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
} )

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isSuccessReviewPagination = false;
            // state.isLoading = false;
            state.message = "";
        }
    },
    
    extraReducers: (builder) => {

        builder
// Average rating
            .addCase(avgRating.fulfilled, (state, action) => {
                state.avg = action.payload
            })

// See reviews
            .addCase(getReviews.pending, (state) => {
                // state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.isSuccessReviewPagination = true;
                // state.isLoading = false;
            })
        
// Update review
            .addCase(updateReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateReview.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(updateReview.pending, (state) => {
                state.isLoading = true;
            })
    }
})

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;