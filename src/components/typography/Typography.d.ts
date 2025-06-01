import { ReactNode } from "react"
import { StyleProp, Text, NativeSyntheticEvent, TextLayoutEventData, GestureResponderEvent } from "react-native"

export interface TypographyProps {
    variant?:
    "TittleTextBold"
    | "HeaderTextBold"
    | "LargeTextBold"
    | "MediumTextBold"
    | "NormalTextBold"
    | "SmallTextBold"
    | "SmallerTextBold"
    | "TittleTextRegular"
    | "HeaderTextRegular"
    | "LargeTextRegular"
    | "MediumTextRegular"
    | "NormalTextRegular"
    | "SmallTextRegular"
    | "TittleTextSemiBold"
    | "HeaderTextSemiBold"
    | "LargeTextSemiBold"
    | "MediumTextSemiBold"
    | "NormalTextSemiBold"
    | "SmallTextSemiBold"
    | "SmallerTextSemiBold"
    | "SmallerTextRegular",

    color?: string
    styles?: StyleProp,
    children?: ReactNode,
    numberOfLines?: number,
    ellipsizeMode?: 'tail' | 'head' | 'middle' | 'clip' | undefined
    onTextLayout?: | ((event: NativeSyntheticEvent<TextLayoutEventData>) => void) | undefined;
    textBreakStrategy?: "highQuality" | 'simple' | 'balanced' | undefined;
    dataDetectorType?:
    | null
    | 'phoneNumber'
    | 'link'
    | 'email'
    | 'none'
    | 'all'
    | undefined;
    lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;

    onPressIn?: ((event: GestureResponderEvent) => void) | undefined;
    onPressOut?: ((event: GestureResponderEvent) => void) | undefined;
    onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
}