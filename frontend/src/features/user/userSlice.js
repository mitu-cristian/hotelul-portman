import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
    userMe: null,
    reviewMe: null,
    checkReviewMe: false,
    isErrorMe: false,
    isSuccessMe: false,
    isSuccessMeAddReview: false,
    isLoadingMe: false,
    messageMe: ""
}

// Get me
export const getMe = createAsyncThunk("user/getMe", async(thunkAPI) => {
    try {
        return await userService.getMe();
    }
    catch(error) {
        const message = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
})

// Update my user
export const updateMe = createAsyncThunk("user/updateMe", async(userData, thunkAPI) => {
    try {
        return await userService.updateMe(userData)
    }
    catch(error) {
        const message = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
})

// Update password
export const updatePass = createAsyncThunk("user/updatePass", async(userData, thunkAPI) => {
    try {
        return await userService.updatePass(userData);
    }

    catch(error) {
        const message = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
})

// See my review
export const getMyReview = createAsyncThunk("user/getReview", async (thunkAPI) => {
    try {
        return await userService.getMyReview();
    }

    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Delete my review
export const deleteMyReview = createAsyncThunk("user/deleteReview", async (thunkAPI) => {
    try {
        return await userService.deleteMyReview();
    }

    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Add my review
export const addMyReview = createAsyncThunk("user/addReview", async (userData, thunkAPI) => {
    try {
        return await userService.addMyReview(userData);
    }

    catch(error) {
        const message = error.response.data.error || (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Check if the user can add a review <=> has at least one reservation in status completed
export const checkReview = createAsyncThunk("user/checkReview", async (thunkAPI) => {
    try {
        return await userService.checkReview();
    }

    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

export const userSlice = createSlice({
    name: "userMe",
    initialState,
    reducers: {
        resetMe: (state) => {
            state.isErrorMe = false;
            state.isSuccessMe = false;
            state.isSuccessMeAddReview = false;
            state.isLoadingMe = false;
            state.messageMe = ""
        }
    },
    extraReducers: (builder) => {
        builder

    // Get me
            .addCase(getMe.pending, (state) => {
                state.isLoadingMe = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoadingMe = false;
                state.isSuccessMe = true;
                state.userMe = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoadingMe = false;
                state.isErrorMe = true;
                state.messageMe = action.payload;
                state.userMe = null;
            })

    // Update me
            .addCase(updateMe.pending, (state) => {
                state.isLoadingMe = true;
            })
            .addCase(updateMe.fulfilled, (state, action) => {
                state.isLoadingMe = false;
                state.isSuccessMe = true;
                state.messageMe = action.payload;
            })
            .addCase(updateMe.rejected, (state, action) => {
                state.isLoadingMe = false;
                state.isErrorMe = true;
                state.messageMe = action.payload;
            })
    
    // Update pass
            .addCase(updatePass.pending, (state) => {
                state.isLoadingMe = true;
            })
            .addCase(updatePass.fulfilled, (state, action) => {
                state.isLoadingMe = false;
                state.isSuccessMe = true;
                state.messageMe = action.payload;
            })
            .addCase(updatePass.rejected, (state, action) => {
                state.isLoadingMe = false;
                state.isErrorMe = true;
                state.messageMe = action.payload;
            })

    // See my review
            .addCase(getMyReview.pending, (state) => {
                state.isLoadingMe = true;
            })
            .addCase(getMyReview.fulfilled, (state, action) => {
                state.isLoadingMe = false;
                state.reviewMe = action.payload;
            })
            
    // Delete my review
            .addCase(deleteMyReview.rejected, (state, action) => {
                state.messageMe = action.payload;
                state.isErrorMe = true;                
            })
            .addCase(deleteMyReview.fulfilled, (state, action) => {
                state.messageMe = "Recenzia dvs. a fost ștearsă.";
                state.isSuccessMe = true;
                state.reviewMe = null;
            })

    // Check if a user can add a review
            .addCase(checkReview.pending, (state) => {
                state.isLoadingMe = true;
            })
            .addCase(checkReview.fulfilled, (state, action) => {
                state.isLoadingMe = false;
                state.checkReviewMe = action.payload;
            })
    // Add my review
            .addCase(addMyReview.rejected, (state, action) => {
                state.isErrorMe = true;
                state.messageMe = action.payload;
            })
            .addCase(addMyReview.fulfilled, (state, action) => {
                state.isSuccessMeAddReview = true;
                state.reviewMe = action.payload;
                state.messageMe = "Recenzia dvs. a fost procesată."
            })
    }
})

export const {resetMe} = userSlice.actions;
export default userSlice.reducer;