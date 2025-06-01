import { createSlice } from "@reduxjs/toolkit";

type onBoard = true | false | null
interface initialStateProps {
    onBoard: onBoard,
    isSignIn: onBoard,
}
const initialState: initialStateProps = {
    onBoard: null,
    isSignIn: null,
}
const authAuth = createSlice({
    name: "appauth",
    initialState,
    reducers: {
        setOnBoard: (state, prevnavigation) => {
            state.onBoard = prevnavigation.payload.onBoard
        },
        setIsSignIn: (state, prevnavigation) => {
            state.isSignIn = prevnavigation.payload.isSignIn
        },
    }
})

export const { setOnBoard, setIsSignIn } = authAuth.actions;
export default authAuth.reducer;