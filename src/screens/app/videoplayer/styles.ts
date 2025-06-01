import { StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "../../../theme/colors";
import { hexToRgb } from "../../../utils/hexToRgb";
import { useScreenOrientation } from "../../../utils/screenorientation";

export const useStyles = () => {
    const insets = useSafeAreaInsets();
    const { orientation: screenOrientation } = useScreenOrientation();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.grey[900]
        },
        videoContainer: {
            flex: 1,
        },
        video: {
            width: '100%',
            height: '100%',
        },
        "playbackspeed.modal": {
            flex: 1
        },
        "playbackspeed.container": {
            padding: 15,
            width: 180,
            backgroundColor: colors.common.white,
            position: "absolute",
            bottom: insets.bottom + 50,
            right: 15,
            borderRadius: 12
        },
        "playbackspeed.headerText": {
            paddingBottom: 10,
            borderBottomColor: colors.grey[400],
            borderBottomWidth: 1,
            borderStyle: "solid"
        },
        "playbackspeed.itemContainer": {
            paddingVertical: 8
        },
        "playbackspeed.ItemSeparator": {
            height: 1,
            backgroundColor: colors.grey[300]
        },
        "control.headeSection.container": {
            backgroundColor: hexToRgb(colors.common.black, .5), paddingHorizontal: 15, width: "100%", top: 0, paddingTop: insets.top, position: "absolute",
        },
        "control.centerSection.container": {
            top: "50%", zIndex: 999, position: 'absolute', width: "100%",
        },
        "control.bottomSection.container": {
            backgroundColor: hexToRgb(colors.common.black, .5), paddingHorizontal: 10, width: "100%", bottom: 0, paddingBottom: insets.bottom, position: "absolute",
        },
        "headeSection.itemContainer": {
            display: "flex", flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: screenOrientation === "landscape" ? 15 : 10
        },
        "centerSection.itemContainer": {
            display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around",
        },
        "bottomSection.itemContainer": {
            display: "flex", flexDirection: "row", alignItems: "center", gap: 0, height: 40,
        },
        "centerSection.control.buttons": {
            width: 45, height: 45, borderRadius: (45 / 2), alignItems: "center", justifyContent: "center",
        }
    })
}