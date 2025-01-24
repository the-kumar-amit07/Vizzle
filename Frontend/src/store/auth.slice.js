import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logIn: (state, action) => {
            // console.log("logIn Reducer Fired with payload:", action.payload); // Log the payload
            state.status = true;
            state.userData = action.payload;
        },
        logOut: (state) => {
            state.status = false,
            state.userData = null;
        },
    }
})

export const {logIn, logOut} = authSlice.actions;
export default authSlice.reducer;