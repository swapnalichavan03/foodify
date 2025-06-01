export interface IImages {
    "_id": string,
    "url": string,
}

export interface I_Creator {
    _id: string
}

export interface IRecipes {
    "_id": string,
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
    "_creator": I_Creator
}