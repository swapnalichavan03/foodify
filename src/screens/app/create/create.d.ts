import { Dispatch, SetStateAction } from "react"
import { ToasterProps } from '../../../components/toastmessage'

export type actionType = "addrecipe" | "recipetype" | "ingredients" | "instructions" | "recipesubmission"

export interface actionProps {
    action: actionType,
    setAction: Dispatch<SetStateAction<actionType>>,
    activeAction: actionType[],
    setActiveAction: Dispatch<SetStateAction<actionType[]>>,
    toaster: ToasterProps,
    setToaster: Dispatch<SetStateAction<ToasterProps>>
}

export interface imagesProps { _id: number, url: string, type: string, size: null | number | string, fileName?: string }
export interface IAppliances { _id: number, title: string, image: imagesProps | null }
export interface addrecipeProps {
    recipename: string,
    recipediscription: string,
    images: imagesProps[]
}
export interface recipeTypeProps {
    serves: number,
    appliances: IAppliances[]
}
export interface ingredientsProps {
    _id: number,
    name: string,
    measurementunit: string,
    quantity: string,
    images: imagesProps
}
export interface instructionsProps {
    _id: number,
    images: imagesProps,
    title: string,
    description: string,
}
export interface IRecipeSubmission {
    category: string,
    tags: string[],
    status: "DRAFT" | "PUBLISHED",
    isScheduleed: true | false,
    schedule: {
        date: string,
        time: string,
    },
    video?: string
}

export interface ICategories {
    _id: string,
    type: string,
    description: string,
}

export interface ITime {
    title: "Morning" | "Afternoon" | "Evening",
    time: string,
    value: string,
}

export interface IRecipe {
    _creator?: string,
    recipename: string,
    recipediscription:string,
    serves: number,
    appliances: {
        title?: string,
        image: string,
        quantity?: number,
    }[],
    images: { url: string }[],
    video?: string,
    ingredients: {
        ingredient: string,
        measurementunit: string,
        quantity: string,
        images: { url: string }[]
    }[],
    instructions: {
        instruction: String,
        description: String,
        images: { url: string }[];
    }[],
    status: "DRAFT" | "PUBLISHED",
    isScheduleed: true | false,
    schedule: {
        date: string,
        time: string
    },
    preparingTime: {
        HH: number,
        MM: number,
    },
    tags: string[],
    categorie: string,
    createdAt?: string,
    updatedAt?: string,
}