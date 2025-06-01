import { StyleSheet } from "react-native";

export const useStyle = () => {
    return StyleSheet.create({
        container: {
            height: 160,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            display: 'flex',
            flexDirection: "row",
        },
        scrollView: {
            width: "100%",
        },
        item: {
            height: 40, // Matches the snapToInterval
            justifyContent: "center",
            alignItems: "center",
        },
        itemText: {
            fontSize: 16,
        },
        activeText: {
            color: "#000", // Highlighted text color (black)
            fontWeight: "bold",
            fontSize: 18,
        },
        inactiveText: {
            color: "gray", // Faded text color
            fontWeight: "normal",
        },
        padding: {
            height: 60, // Padding to center the first and last items
        },
        indicator: {
            height: 40,
            width: "100%",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: "#ccc",
            borderBottomColor: "#ccc",
            position: "absolute",
            top: 60, // Center of the scroll wheel
        },
    })
}