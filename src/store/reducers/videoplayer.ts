import { createSlice } from "@reduxjs/toolkit";


interface initialStateProps {
    orientation: "portrait" | "landscape",
}
const initialState: initialStateProps = {
    orientation: "portrait",
}
const videoPlayer = createSlice({
    name: "videoplayer",
    initialState,
    reducers: {
        setOrientation: (state, prevnavigation) => {
            state.orientation = prevnavigation.payload.proorientationfile
        },
    }
})

export const { setOrientation } = videoPlayer.actions;
export default videoPlayer.reducer;