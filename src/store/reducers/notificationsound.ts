import { createSlice } from "@reduxjs/toolkit";


export interface INotification {
    notification: true | false,
    vibrate: true | false,
    sound: string
}
export interface INotificationSound {
    notification: {
        notification: true | false,
        sound: {
            recipe: INotification,
            follower: INotification
        }
    }
}
const initialState: INotificationSound = {
    notification: {
        notification: true,
        sound: {
            recipe: {
                notification: true,
                vibrate: true,
                sound: "default"
            },
            follower: {
                notification: true,
                vibrate: true,
                sound: "default"
            }
        }
    }
}
const notificationSound = createSlice({
    name: "notificationSound",
    initialState,
    reducers: {
        setNotificationSound: (state, prevnavigation) => {
            state.notification = prevnavigation.payload.sound?.notification
        },
    }
})

export const { setNotificationSound } = notificationSound.actions;
export default notificationSound.reducer;