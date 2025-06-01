import { StyleSheet } from "react-native"
import { colors } from "../../theme/colors"
import { Fonts, FontWeight } from "../../theme/fonts"

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            alignItems: "center",
            paddingHorizontal: 10,
            display: "flex",
            flexDirection: "row",
            borderRadius: 10,
            borderWidth: 1.5,
            borderStyle: "solid",
            gap: 5
        },
        textinput: {
            color: colors.input.text,
            fontSize: 11,
            fontFamily: Fonts.PoppinsRegular,
            fontWeight: FontWeight.PoppinsRegular,
            flex: 1
        }
    })
}