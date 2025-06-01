import { StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const useStyles = () => {
    const insets = useSafeAreaInsets();

    return StyleSheet.create({
        "keyboardavoidingaiew.style": {
            flex: 1,
        },
        "scrollview.style": {
            flex: 1,
        },
        "scrollview.contentcontainerstyle": {
            gap: 15,
            paddingHorizontal: 20,
            paddingVertical: 20
        },
        "buttton.container": {
            paddingHorizontal: 20,
            paddingBottom: insets.bottom || 10,
            paddingTop: 10,
            gap: 10
        }
    })
}