import { ReactNode } from "react";
import { TouchableOpacityProps } from "react-native";

export interface buttonProps extends TouchableOpacityProps {
    children?: ReactNode,
    variant?: "outline" | "text" | "contain",
    size?: "small" | "large" | "medium" | "tab",
    color?: string,
    textColor?: string,
    buttonColor?:  string,
    paddingHorizontal?:  number,
    isLoading?: true | false
}