import { createSlice } from "@reduxjs/toolkit";
import { recipedetailsProps } from "../../screens/app/recipedetails/recipedetails";

interface initialStateProps {
    recipe: recipedetailsProps | null,
}
const initialState: initialStateProps = {
    recipe: null,
}
const recipe = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        setRecipeDetails: (state, prevnavigation) => {
            state.recipe = prevnavigation.payload.recipe
        },
    }
})

export const { setRecipeDetails } = recipe.actions;
export default recipe.reducer;