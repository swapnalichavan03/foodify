interface IImagesProps {
    "url": string,
    "_id": string
}

export interface IFollowing {
    _id: string,
    _user: string
}
interface _creatorProps {
    "_id": string,
    "customerName": string,
    "assets": {
        "profileImage": string | null
    },
    "totalfollowers": number,
    "basic_info": {
        "location": string,
    },
    "followers": IFollowing[],
}
interface ingredientsProps {
    "ingredient": string,
    "measurementunit": string,
    "quantity": string,
    "images": IImagesProps[],
    "_id": string,
}
interface instructionsProps {
    "instruction": string,
    "description": string,
    "images": IImagesProps[],
    "_id": string,
}
export interface ILikes {
    "_user": string,
    "_type"?: string
}
export interface ISaves {
    "_user": string,
}
export interface IAppliances {
    title: string,
    image: string,
    quantity: number
}
export interface IRatings {
    _user: string,
    _ratings: string
}
export interface IPreparingTime {
    "HH": number,
    "MM": number
}
export interface recipedetailsProps {
    "_id": string,
    "_creator": _creatorProps,
    "recipename": string,
    "recipediscription": string,
    "images": IImagesProps[],
    "video": string,
    "ingredients": ingredientsProps[],
    "instructions": instructionsProps,
    "createdAt": string,
    "totallikes": number,
    "totalsaves": number,
    "totalratings": number,
    "totalIngredients": number,
    "totalInstructions": number,
    "serves": number,
    "appliances": IAppliances[],
    "avgRating": number,
    "totalreviews": number,
    "likes": ILikes[],
    "saves": ISaves[],
    "ratings": IRatings[],
    "preparingTime": IPreparingTime,
}