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
export interface IRatings {
    _user: string,
    _ratings: string
}
export interface IIRecipesProps {
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
    "ratings": IRatings[],
    "preparingTime": {
        "HH": number,
        "MM": number
    },
}



export interface IUsers {
    "_id": string,
    "customerName": string,
    "assets": {
        "profileImage": string
    },
    "basic_info": {
        "header": string,
        "location": string
    },
    "createdAt": string
}