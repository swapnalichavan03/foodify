export interface IImages {
    "_id": string,
    "url": string,
}
export interface ICreator {
    _id: string,
}
export interface IRecipes {
    "_id": string,
    "_creator": ICreator,
    "avgRating": number,
    "images": IImages[],
    "status": "PUBLISHED" | "DRAFT",
    "isScheduleed": true | false,
    "video": string,
    "preparingTime": {
        "HH": number,
        "MM": number
    },
    "recipename": string,
}