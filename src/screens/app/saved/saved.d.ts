interface imagesProps {
    "url": string,
    "_id": string
}

export interface ILikes {
    "_user": string,
    "_type": string
}
export interface ISaves {
    "_user": string,
}
export interface IRecipesProps {
    "_id": string,
    "_creator": {
        "_id": string,
        "customerName": string,
        "assets": {
            "profileImage": string | null
        }
    },
    "recipename": string,
    "recipediscription": string,
    "images": imagesProps[],
    "categorie": string,
    "createdAt": string,
    "totallikes": number,
    "totalsaves": number,
    "avgRating": number,
    "likes": ILikes[],
    "saves": ISaves[],
    "preparingTime": {
        "HH": number,
        "MM": number
    },
}