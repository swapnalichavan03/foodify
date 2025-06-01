import { ReactNode } from "react";
import { TextInputProps as InputProps, } from "react-native";

export interface TextFieldProps extends InputProps {
    startIcon?: () => ReactNode,
    endIcon?: () => ReactNode,
    lable?: string | number | undefined;
    error?: string,
    isError?: true | false
    showError?: true | false,
    isRequired?: true | false,
    disable?: false | true,
    size?: "small" | "large",
    height?: number
}