import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const tabnavigation = createSlice({
    name: "tabnavigation",
    initialState: {
        prevnavigation: "",
    },
    reducers: {
        setPrevNavigation: (state, prevnavigation) => {
            state.prevnavigation = prevnavigation.payload.prevnavigation
        }
    }
})

export const { setPrevNavigation } = tabnavigation.actions;
export default tabnavigation.reducer;