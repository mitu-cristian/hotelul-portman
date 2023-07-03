import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// Register
export const register = createAsyncThunk("auth/register", async(user, thunkAPI) => {
    try {
        return await authService.register(user);
    }

    catch(error) {
        const message = error.response.data.error;  
        return thunkAPI.rejectWithValue(message);
    }   
})

// Login
export const login = createAsyncThunk("auth/login", async(user, thunkAPI) => {
    try {
        return await authService.login(user);
    }

    catch(error) {
        const message = error.response.data.error;
        console.log(error)
        return thunkAPI.rejectWithValue(message);
    }
})

// Logout
export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
    try {
        await authService.logout();
    }

    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

// Delete account
export const deleteAcc = createAsyncThunk("auth/deleteAcc", async(thunkAPI) => {
    try {
        return await authService.deleteAcc();
    }
    catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message);
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {

    // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.message = "Înregistrare reușită";
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

    // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.message = "Autentificare reușită."
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

    // Logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.rejected, (state, action) => {
                state.message = action.payload;
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.message = action.payload;
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null;
            })

    // Delete account
            .addCase(deleteAcc.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAcc.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Contul dvs. a fost șters.";
                state.user = null;
            })
            .addCase(deleteAcc.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})

export const {reset} = authSlice.actions;
export default authSlice.reducer;