
export interface IAssets {
    profileImage: string | null
}
export interface ISender {
    "_id": string,
    "customerName": string,
    "assets": IAssets
}
export interface IReceiver {
    "_id": string,
    "customerName": string,
    "assets": IAssets
}

export interface IRecipe {
    _id: string,
    _creator: string,
    recipename: string,
    images: {
        url: string
    }
}
export interface INotification {
    "_id": string,
    "_sender": ISender,
    "_receiver": IReceiver,
    "category": "NEWFOLLOWER" | "NEWRECIPE" | "SAVEDRECIPE",
    "isRead": true,
    "title": "New Follower!",
    "createdAt": string,
    "updatedAt": string,
    "_recipe": IRecipe
}