import React, { Fragment } from 'react'
import { buttonProps } from './Button'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import Typography from '../typography'
import { colors } from '../../theme/colors'

const Button = (props: buttonProps) => {

    const size = {
        small: 37,
        large: 54,
        medium: 46,
        tab: 33,
    };

    const fontsize = {
        small: "SmallerTextBold",
        large: "NormalTextBold",
        medium: "NormalTextRegular",
        tab: "SmallerTextBold",
    };

    const textcolor = {
        contain: props.textColor ? props.textColor : colors.common.white,
        text: props.textColor ? props.textColor : colors.primary.main,
        outline: props.textColor ? props.textColor : colors.primary.main,
    };

    const loaderColor = {
        contain: colors.common.white,
        text: colors.primary.main,
        outline: colors.primary.main,
    }
    return (
        <Fragment>
            <TouchableOpacity
                {...props}
                activeOpacity={.70}
                style={{
                    ...(!props.variant && {
                        backgroundColor: props.buttonColor ? props.buttonColor : colors.primary.main,
                        borderWidth: 1.5,
                        borderColor: props.buttonColor ? props.buttonColor : colors.primary.main,
                        borderStyle: "solid"
                    }),
                    ...(props.variant === "contain" && {
                        backgroundColor: props.buttonColor ? props.buttonColor : colors.primary.main,
                        borderWidth: 1.5,
                        borderColor: props.buttonColor ? props.buttonColor : colors.primary.main,
                        borderStyle: "solid"
                    }),
                    ...(props.variant === "text" && {

                    }),
                    ...(props.variant === "outline" && {
                        borderWidth: 1.5,
                        borderColor: props.buttonColor ? props.buttonColor : colors.primary.main,
                        borderStyle: "solid"
                    }),
                    height: size[props.size || "medium"],
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 10
                }}
            >
                {props.isLoading ?
                    <ActivityIndicator color={loaderColor[props.variant || "contain"]} />
                    :
                    <Typography variant={fontsize[props.size || "medium"] as 'NormalTextBold'} color={textcolor[props.variant || "contain"]}>
                        {props.children}
                    </Typography>
                }
            </TouchableOpacity>
        </Fragment>
    )
}

export default Button
