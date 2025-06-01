import { NativeModules, Platform } from 'react-native';
import { type Sound } from "./notificationsound"

const { NotificationSounds } = NativeModules;

export default NotificationSounds;

export const playSampleSound = (soundObject: Sound) => {
    const sound = soundObject.url;
    NotificationSounds.playSample(sound);
};

export const stopSampleSound = () => {
    // const sound = Platform.OS === 'ios' ? soundObject.soundID : soundObject.url;
    NotificationSounds.stopSample();
};

export const getNotificationSound = async (type?: "notification" | "ringtone" | "alarm") => {
    return new Promise((resolve, reject) => {
        NotificationSounds.getNotifications(type || "notification")
            .then((sounds: Sound) => {
                if (Array.isArray(sounds)) {
                    resolve(sounds)
                } else {
                    reject(sounds)
                }
            });
    })
}
export const getDefaultNotificationSound = async (type?: "notification" | "ringtone" | "alarm") => {
    return new Promise((resolve, reject) => {
        NotificationSounds.getDefaultSound()
            .then((sounds: Sound) => {
                if (sounds) {
                    resolve(sounds)
                } else {
                    reject(sounds)
                }
            });
    })
}

type SOUNDTYPE = {
    NOTIFICATION: "notification",
    RINGTONE: "ringtone",
    ALARM: "alarm",
}
export const SOUNDTYPE: SOUNDTYPE = {
    NOTIFICATION: "notification",
    RINGTONE: "ringtone",
    ALARM: "alarm",
}