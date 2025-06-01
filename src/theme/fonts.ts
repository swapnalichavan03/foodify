interface FontsProps {
    PoppinsBlack: string,
    PoppinsBlackItalic: string,
    PoppinsBold: string,
    PoppinsBoldItalic: string,
    PoppinsExtraBold: string,
    PoppinsExtraBoldItalic: string,
    PoppinsExtraLight: string,
    PoppinsExtraLightItalic: string,
    PoppinsItalic: string,
    PoppinsLight: string,
    PoppinsLightItalic: string,
    PoppinsMedium: string,
    PoppinsMediumItalic: string,
    PoppinsRegular: string,
    PoppinsSemiBold: string,
    PoppinsSemiBoldItalic: string,
    PoppinsThin: string,
    PoppinsThinItalic: string,
}

export const Fonts: FontsProps = {
    PoppinsBlack: "Poppins-Black",
    PoppinsBlackItalic: "Poppins-BlackItalic",
    PoppinsBold: "Poppins-Bold",
    PoppinsBoldItalic: "Poppins-BoldItalic",
    PoppinsExtraBold: "Poppins-ExtraBold",
    PoppinsExtraBoldItalic: "Poppins-ExtraBoldItalic",
    PoppinsExtraLight: "Poppins-ExtraLight",
    PoppinsExtraLightItalic: "Poppins-ExtraLightItalic",
    PoppinsItalic: "Poppins-Italic",
    PoppinsLight: "Poppins-Light",
    PoppinsLightItalic: "Poppins-LightItalic",
    PoppinsMedium: "Poppins-Medium",
    PoppinsMediumItalic: "Poppins-MediumItalic",
    PoppinsRegular: "Poppins-Regular",
    PoppinsSemiBold: "Poppins-SemiBold",
    PoppinsSemiBoldItalic: "Poppins-SemiBoldItalic",
    PoppinsThin: "Poppins-Thin",
    PoppinsThinItalic: "Poppins-ThinItalic",
}

type fontweightType = | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 'ultralight'
    | 'thin'
    | 'light'
    | 'medium'
    | 'regular'
    | 'semibold'
    | 'condensedBold'
    | 'condensed'
    | 'heavy'
    | 'black'
    | undefined;

export interface fontweightProps {
    PoppinsBlack: fontweightType,
    PoppinsBlackItalic: fontweightType,
    PoppinsBold: fontweightType,
    PoppinsBoldItalic: fontweightType,
    PoppinsExtraBold: fontweightType,
    PoppinsExtraBoldItalic: fontweightType,
    PoppinsExtraLight: fontweightType,
    PoppinsExtraLightItalic: fontweightType,
    PoppinsItalic: fontweightType,
    PoppinsLight: fontweightType,
    PoppinsLightItalic: fontweightType,
    PoppinsMedium: fontweightType,
    PoppinsMediumItalic: fontweightType,
    PoppinsRegular: fontweightType,
    PoppinsSemiBold: fontweightType,
    PoppinsSemiBoldItalic: fontweightType,
    PoppinsThin: fontweightType,
    PoppinsThinItalic: fontweightType,
}

export const FontWeight: fontweightProps = {
    PoppinsBlack: "900",
    PoppinsBlackItalic: "900",
    PoppinsBold: "700",
    PoppinsBoldItalic: "700",
    PoppinsExtraBold: "800",
    PoppinsExtraBoldItalic: "800",
    PoppinsExtraLight: "200",
    PoppinsExtraLightItalic: "200",
    PoppinsItalic: "normal",
    PoppinsLight: "300",
    PoppinsLightItalic: "300",
    PoppinsMedium: "500",
    PoppinsMediumItalic: "500",
    PoppinsRegular: "400",
    PoppinsSemiBold: "600",
    PoppinsSemiBoldItalic: "600",
    PoppinsThin: "100",
    PoppinsThinItalic: "100",
}