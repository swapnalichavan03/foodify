import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("screen")
export const imagesize: IImagesize = {
    "recipe": {
        width: width,
        height: 200,
    },
    "instructions": {
        width: width,
        height: 200,
    },
    "ingredients": {
        width: width,
        height: 200,
    },
    "profile": {
        width: 200,
        height: 200,
    },
    "appliances": {
        width: 100,
        height: 100,
    },
    "review": {
        width: width,
        height: 200,
    },
    "video": {
        width: width,
        height: 200,
    },
}


interface IImagesize {
    "recipe": {
        width: number,
        height: number,
    },
    "instructions": {
        width: number,
        height: number,
    },
    "ingredients": {
        width: number,
        height: number,
    },
    "profile": {
        width: number,
        height: number,
    },
    "appliances": {
        width: number,
        height: number,
    },
    "review": {
        width: number,
        height: number,
    },
    "video": {
        width: number,
        height: number,
    },
}