import { createSlice } from "@reduxjs/toolkit";



export interface IAssets {
    "profileImage": string | null
}
export interface IFollowing {
    _id: string,
    _user: string
}
export interface IBasicInfo {
    "header": string | null,
    "description": string | null,
    "location": string | null,
    "interested_in"?: [],
    "website_url"?: []
}
export interface IProfile {
    "_id": string,
    "email": string,
    "mobile": number,
    "customerName": string,
    "status": string,
    "assets": IAssets,
    "basic_info": IBasicInfo,
    "createdAt": string,
    "totalfollowers": number,
    "totalfollowing": number,
    "totalrecipes": number,
    "followers": IFollowing[],
    "gender": string;
    "dateOfbirth": string;
    "image": string
}
interface initialStateProps {
    profile: IProfile | null,
}
const initialState: initialStateProps = {
    profile: null,
}
const userProfile = createSlice({
    name: "userprofile",
    initialState,
    reducers: {
        setProfile: (state, prevnavigation) => {
            state.profile = prevnavigation.payload.profile
        },
        setProfileImage: (state, prev) => {
            if (state.profile) {
                state.profile.image = prev.payload.image;
            }
        }
    }
})

export const { setProfile, setProfileImage } = userProfile.actions;
export default userProfile.reducer;