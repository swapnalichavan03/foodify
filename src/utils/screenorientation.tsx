import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export const useScreenOrientation = () => {
    const [orientation, setOrientation] = useState<"portrait" | "landscape">('portrait');

    useEffect(() => {
        const updateOrientation = () => {
            const { width, height } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        // Add event listener
        const subscription = Dimensions.addEventListener('change', updateOrientation);

        // Initial orientation check
        updateOrientation();

        return () => {
            if (subscription?.remove) {
                subscription.remove();
            }
        };
    }, []);

    return { orientation }
}