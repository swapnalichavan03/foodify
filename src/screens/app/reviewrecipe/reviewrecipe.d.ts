export interface ICreator {
    "_id": string,
    "customerName": string,
    "assets": {
        "profileImage": string
    }
}
export interface ILikes {
    "_user": "6767c2a8aef17e0cf4a66c9c",
    "_type": "like" | "dislike"
}
export interface IReviewrecipe {
    "_id": string,
    "_creator": ICreator,
    "_recipe": string,
    "review": string,
    "images": {url: string, _id: string}[],
    "createdAt": string,
    "likeCount": number,
    "dislikeCount": number,
    "likes": ILikes[]
}