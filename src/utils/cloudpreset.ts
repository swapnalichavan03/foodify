export type presettype =
    "recipes_preset"
    | "instructions_preset"
    | "ingredients_preset"
    | "profileimages_preset"
    | "appliances_preset"
    | "review_preset"
    | "recipevideo_preset"
    
export const cloudpreset: IPreset = {
    recipe: "recipes_preset",
    instructions: "instructions_preset",
    ingredients: "ingredients_preset",
    profile: "profileimages_preset",
    appliances: "appliances_preset",
    review: "review_preset",
    video: "recipevideo_preset",
};

export const cloudfolder: ICloudfolder = {
    recipes_preset: "recipes",
    instructions_preset: "instructions",
    ingredients_preset: "ingredients",
    profileimages_preset: "profileimages",
    appliances_preset: "appliances",
    review_preset: "review",
    recipevideo_preset: "recipevideo"
}

interface ICloudfolder {
    recipes_preset: "recipes",
    instructions_preset: "instructions",
    ingredients_preset: "ingredients",
    profileimages_preset: "profileimages",
    appliances_preset: "appliances",
    review_preset: "review",
    recipevideo_preset: "recipevideo"
}
interface IPreset {
    "recipe": presettype, // "recipes_preset",
    "instructions": presettype, // "instructions_preset",
    "ingredients": presettype, // "ingredients_preset",
    "profile": presettype, // "profileimages_preset",
    "appliances": presettype, // "appliances_preset",
    "review": presettype, // "review_preset",
    "video": presettype, // "recipevideo_preset"
}