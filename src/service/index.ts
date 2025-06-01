import { IRecipe } from "../screens/app/create/create";
import { IProfileDetailsType } from "../screens/app/editprofile";
import { IProfile } from "../store/reducers/userprofile";
import { axiosInstance } from "./api";

// user
export const usersignin = (data: { username: String, password: String, notification: { token?: String, device?: String }, }) => axiosInstance.post("/customer/signin", data);
export const usergooglesignin = (data: { idToken: String, }) => axiosInstance.post("/customer/google/signin", data);
export const userfacesignin = (data: { username: String, password: String, notification: { token?: String, device?: String }, }) => axiosInstance.post("/customer/facebook/signin", data);
export const usersignup = (data: any) => axiosInstance.post("/customer/signup", data);
export const getprofile = () => axiosInstance.get("/customer/get/profile");
export const getuserprofile = (_user: string) => axiosInstance.get(`/customer/get/profile/${_user}`);
export const FollowUser = async (_user: string) => await axiosInstance.patch(`/user/${_user}/follow`)
export const UnFollowUser = async (_user: string) => await axiosInstance.patch(`/user/${_user}/unfollow`) // not implemented
export const updateprofiledetails = async (data: IProfileDetailsType) => await axiosInstance.patch("/user/update/details", data)
export const getfollowers = async (_user: string, query?: string) => await axiosInstance.get(`/user/${_user}/followers/users?${query}`);
export const getfollowing = async (_user: string, query?: string) => await axiosInstance.get(`/user/${_user}/following/users?${query}`);
export const usersearch = async (query?: string) => await axiosInstance.get(`/user/search?${query}`)

// recipe
export const createrecipe = (data: IRecipe) => axiosInstance.post(`/food/recipe`, data)
export const updaterecipe = () => axiosInstance.patch(``)
export const deleterecipe = (_recipe: string, _creator: string) => axiosInstance.delete(`/food/recipe/${_recipe}/creator/${_creator}`)
export const getrecipes = (query?: string) => axiosInstance.get(`/food/recipes?${query}`)
export const getrecipe = (_recipe: string, _user: string) => axiosInstance.get(`/food/recipe/${_recipe}/creator/${_user}`)
export const likerecipe = (_recipe: string, _user: string) => axiosInstance.patch(`/recipe/like/${_recipe}/creator/${_user}`)
export const dislikerecipe = (_recipe: string, _user: string) => axiosInstance.patch(`/recipe/unlike/${_recipe}/creator/${_user}`)
export const saverecipe = (_recipe: string, _user: string) => axiosInstance.patch(`/recipe/save/${_recipe}/creator/${_user}`)
export const unsaverecipe = (_recipe: string, _user: string) => axiosInstance.patch(`/recipe/unsave/${_recipe}/creator/${_user}`)
export const reciperating = (_recipe: string, _user: string, data: { _rating: number }) => axiosInstance.patch(`/recipe/rating/${_recipe}/creator/${_user}`, data)
export const getsavedrecipe = async (query?: string) => await axiosInstance.get(`/food/saved/recipe?${query}`)
export const getlikedrecipe = async (query?: string) => await axiosInstance.get(`/food/liked/recipe?${query}`)

// reviews
export const getreviews = async (_recipe: string, _user: string, query?: string) => await axiosInstance.get(`/recipe/${_recipe}/reviews?${query}`)
export const getreview = async (_recipe: string, _review: string) => await axiosInstance.get(`/recipe/${_recipe}/review/${_review}`)
export const addreview = async (_recipe: string, data: { review: string, images: { url: string }[] }) => await axiosInstance.post(`/recipe/${_recipe}/review`, data)
export const updatereview = async (_recipe: string, _review: string, data: { review: string, images: { url: string }[] }) => await axiosInstance.patch(`/recipe/${_recipe}/review/${_review}`, data)
export const likereview = async (_recipe: string, _review: string, _user: string, data: { _type: "like" | "dislike" }) => await axiosInstance.patch(`/recipe/${_recipe}/review/${_review}/like/user/${_user}`, data)
export const dislikereview = async (_recipe: string, _review: string, _user: string) => await axiosInstance.patch(`/recipe/${_recipe}/review/${_review}/dislike/user/${_user}`)
export const deletereview = async (_recipe: string, _review: string) => await axiosInstance.delete(`/recipe/${_recipe}/review/${_review}`)

// notifications
export const getnotifications = async (query?: string) => await axiosInstance.get(`/notifications?${query}`)
export const readnotification = async (_notification?: string) => await axiosInstance.patch(`/notification/${_notification}/read`)

// categories
export const getcategories = async (query?: string) => await axiosInstance.get(`/food/categories?${query}`)
