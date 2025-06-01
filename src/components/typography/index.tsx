import React, { Fragment } from 'react'
import { TypographyProps } from './Typography'
import { Text } from 'react-native'
import { Fonts, FontWeight } from '../../theme/fonts'
import { colors } from '../../theme/colors'

export const textvariant = {
    TittleTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 50, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 75 */ },
    HeaderTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 30, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 45 */ },
    LargeTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 20, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 30 */ },
    MediumTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 18, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 27 */ },
    NormalTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 16, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 24 */ },
    SmallTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 14, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 21 */ },
    SmallerTextBold: { fontFamily: Fonts.PoppinsBold, fontSize: 11, fontWeight: FontWeight.PoppinsBold, /* lineHeight: 17 */ },
    
    TittleTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 50, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 75 */ },
    HeaderTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 30, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 45 */ },
    LargeTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 20, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 30 */ },
    MediumTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 18, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 27 */ },
    NormalTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 16, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 24 */ },
    SmallTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 14, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 21 */ },
    SmallerTextRegular: { fontFamily: Fonts.PoppinsRegular, fontSize: 11, fontWeight: FontWeight.PoppinsRegular, /* lineHeight: 17 */ },

    TittleTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 50, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 75 */ },
    HeaderTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 30, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 45 */ },
    LargeTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 20, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 30 */ },
    MediumTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 18, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 27 */ },
    NormalTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 16, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 24 */ },
    SmallTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 14, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 21 */ },
    SmallerTextSemiBold: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 11, fontWeight: FontWeight.PoppinsSemiBold, /* lineHeight: 17 */ },
}

const Typography = ({ children, numberOfLines, variant = "HeaderTextRegular", color = colors.neturalcolour.gray_1, styles, ellipsizeMode = "tail", onTextLayout, textBreakStrategy, dataDetectorType, lineBreakMode, onPress, onPressIn, onPressOut, onLongPress }: TypographyProps) => {

    return (
        <Fragment>
            <Text 
            numberOfLines={numberOfLines} 
            onTextLayout={onTextLayout} 
            ellipsizeMode={ellipsizeMode} 
            textBreakStrategy={textBreakStrategy}
            dataDetectorType={dataDetectorType}
            lineBreakMode={lineBreakMode}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onLongPress={onLongPress}
            style={{ ...textvariant[variant], ...styles, color: color }}>
                {children}
            </Text>
        </Fragment>
    )
}

export default Typography
