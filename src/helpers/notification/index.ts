import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import notifee, { EventType } from '@notifee/react-native';
import { useDeviceInfo } from "../../hooks/use-device-info";
import { useFirebaseMessaging } from "../../hooks/use-push-notifications";

export const useNotification = () => {
    const { uniqueId } = useDeviceInfo();
    const { token, permissionStatus, requestPermission, refreshToken } = useFirebaseMessaging();

    useEffect(() => {
        if (Platform.OS === "android") {
            const setupMessaging = async () => {
                if (permissionStatus === 'unknown') {
                    const granted = await requestPermission();
                    if (granted) {
                        await refreshToken();
                    } else {
                        Alert.alert(
                            'Push Notifications',
                            'We need your permission to send you important updates. You can enable notifications in your device settings.',
                            [{ text: 'OK' }],
                        );
                    }
                }
            };

            setupMessaging();

            const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
                console.log('Foreground event:', type, detail);
                switch (type) {
                    case EventType.DISMISSED:
                        console.log('User dismissed notification', detail.notification);
                        break;
                    case EventType.PRESS:
                        console.log('User pressed notification', detail.notification);
                        break;
                }
            });

            return () => unsubscribe();
        }
    }, [permissionStatus, requestPermission, refreshToken]);

    return {uniqueId, token}
}