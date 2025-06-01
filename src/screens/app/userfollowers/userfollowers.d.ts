interface IFollowers {
    _user: string,
    _id: string
}
interface IAssets {
    profileImage: string
}

export interface IUserfollowers {
    "_id": string,
    "customerName": string,
    "assets": IAssets,
    "totalfollowers": number,
    "totalfollowing": number,
    "followers": IFollowers[],
    "following": IFollowers[],
}