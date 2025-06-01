import { createSlice } from "@reduxjs/toolkit";

export interface imagesProps { _id: number, url: string, type: string, size: null | number | string, fileName?: string }
interface initialStateProps {
    images: imagesProps[],
}
const initialState: initialStateProps = {
    images: [],
}
const recipeReview = createSlice({
    name: "recipereview",
    initialState,
    reducers: {
        setReviewImage: (state, prevnavigation) => {
            if(Array.isArray(prevnavigation.payload.image) && prevnavigation.payload.image.length === 0) {
                state.images = []
            } else if(!prevnavigation.payload.image) {
                state.images = []
            } else {
                state.images.push(prevnavigation.payload.image)
            }
        },
        setUpdateImage: (state, prevnavigation) => {
            state.images = prevnavigation.payload.images
        },
    }
})

export const { setReviewImage, setUpdateImage } = recipeReview.actions;
export default recipeReview.reducer;