import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addrecipeProps, IAppliances, ingredientsProps, instructionsProps, recipeTypeProps } from "../../screens/app/create/create";
import moment from "moment";

export interface imagesProps { _id: number, url: string, type: string, size: null | number | string, fileName?: string }
interface initialStateProps {
    recipe: addrecipeProps,
    ingredients: ingredientsProps[],
    ingredientimage: imagesProps | null,
    instructions: instructionsProps[],
    instructionimage: imagesProps | null,
    recipetype: recipeTypeProps,
    applianceImages: imagesProps | null,
    submission: {
        category: string,
        tags: string[],
        status: "DRAFT" | "PUBLISHED",
        isScheduleed: true | false,
        schedule: {
            date: string,
            time: string,
        },
        video?: string
    },
}
const initialState: initialStateProps = {
    recipe: { recipename: "", recipediscription: "", images: [] },
    ingredients: [],
    ingredientimage: null,
    instructions: [],
    instructionimage: null,
    submission: {
        category: "",
        tags: [],
        status: "PUBLISHED",
        isScheduleed: false,
        schedule: {
            date: moment().format(),
            time: "",
        },
        video: ""
    },
    recipetype: { serves: 0, appliances: [/* { title: "", image: null } */] },
    applianceImages: null,
}
const createrecipe = createSlice({
    name: "createrecipe",
    initialState,
    reducers: {
        setAddRecipeData(state, actions) {
            if (actions.payload.name === "recipename") {
                state.recipe.recipename = actions.payload.value
            } else if (actions.payload.name === "recipediscription") {
                state.recipe.recipediscription = actions.payload.value
            } else if (actions.payload.name === "images" && typeof actions.payload.value === "object") {
                state.recipe.images = [...state.recipe.images, actions.payload.value]
            }
        },
        setDeleteRecipeImage: (state, actions) => {
            const images = state.recipe.images.filter((item: imagesProps) => item.url !== actions.payload.image)
            state.recipe.images = [...images];
        },
        setRecipeType: (state, actions) => {
            if (actions.payload.name === "serves") {
                state.recipetype.serves = actions.payload.value
            } else if (actions.payload.name === "title") {
                // state.recipetype.appliances.title = actions.payload.value
            } else if (actions.payload.name === "image") {
                state.recipetype.appliances = [...state.recipetype.appliances, actions.payload.value]
            }
        },
        setDeleteAppliances: (state, actions) => {
            const data = state.recipetype.appliances.filter((appliances: IAppliances) => appliances._id !== actions.payload._id)
            state.recipetype.appliances = data
        },
        setIngredientsData: (state, actions) => {
            state.ingredients = [...state.ingredients, actions.payload.data]
        },
        setIngredientImage: (state, actions) => {
            state.ingredientimage = actions.payload.image;
        },
        setDeleteIngredientImage: (state, actions) => {
            state.ingredientimage = null;
        },
        setInstructionsData: (state, actions) => {
            state.instructions = [...state.instructions, actions.payload.data]
        },
        setInstructionImage: (state, actions) => {
            state.instructionimage = actions.payload.image;
        },
        setDeleteInstructionsImage: (state, actions) => {
            state.instructionimage = null;
        },
        setRecipeSubmissionData: (state, actions) => {
            const { name, value } = actions.payload;
            if (name === "category") {
                state.submission.category = value
            } else if (name === "tags") {
                state.submission.tags.push(value)
            } else if (name === "isScheduleed") {
                state.submission.isScheduleed = value
            } else if (name === "date") {
                state.submission.schedule.date = value
            } else if (name === "time") {
                state.submission.schedule.time = value
            } else if (name === "video") {
                state.submission.video = value
            }
        },
        setRemoveRecipeTags: (state, actions) => {
            const data = state.submission.tags.filter((tag) => tag !== actions.payload.tag)
            state.submission.tags = data
        },
        setDeleteIngredient: (state, actions) => {
            const data = state.ingredients.filter((item) => item._id !== actions.payload._id)
            state.ingredients = data
        },
        setDeleteStep: (state, actions) => {
            const data = state.instructions.filter((item) => item._id !== actions.payload._id)
            state.instructions = data
        },
        setClearRecipe: (state) => {
            state.recipe = { recipename: "", recipediscription: "", images: [] };
            state.ingredients = [];
            state.ingredientimage = null;
            state.instructions = [];
            state.instructionimage = null;
            state.submission = {
                category: "",
                tags: [],
                status: "PUBLISHED",
                isScheduleed: false,
                schedule: {
                    date: moment().format(),
                    time: "",
                },
                video: ""
            };
            state.recipetype = { serves: 0, appliances: [] };
            state.applianceImages = null;
        }
    }
})

export const {
    setClearRecipe,
    setAddRecipeData,
    setRecipeType,
    setIngredientsData,
    setInstructionsData,
    setRecipeSubmissionData,
    setDeleteRecipeImage,
    setDeleteIngredientImage,
    setDeleteInstructionsImage,
    setIngredientImage,
    setInstructionImage,
    setDeleteIngredient,
    setDeleteStep,
    setDeleteAppliances,
    setRemoveRecipeTags
} = createrecipe.actions;
export default createrecipe.reducer;