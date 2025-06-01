import { createSlice } from "@reduxjs/toolkit";

export interface imagesProps {
    "cropRect": {
        "height": number,
        "width": number,
        "x": number,
        "y": number
    },
    "height": number,
    "mime": string,
    "modificationDate": string,
    "path": string,
    "size": number,
    "width": number
}

interface initialStateProps {
    images: imagesProps[] | []
}
const initialState: initialStateProps = {
    images: []
}
const pickerdImage = createSlice({
    name: "pickeredimages",
    initialState,
    reducers: {
        setPickeredImages: (state, images) => {
            state.images = [...state.images, images.payload.image]
        },
        setDeleteImage: (state, image) => {
            const images = state.images.filter((item: imagesProps) => item.path !== image.payload.image)
            state.images = images;
        }
    }
})

export const { setPickeredImages, setDeleteImage } = pickerdImage.actions;
export default pickerdImage.reducer;