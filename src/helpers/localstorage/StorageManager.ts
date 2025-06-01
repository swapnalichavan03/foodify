import EncryptedStorage from 'react-native-encrypted-storage';
import { isJsonString } from '../../utils/sJsonString';
import { INotificationSound } from '../../store/reducers/notificationsound';

interface LogoutResponse {
    status: number;
    message: string;
    data?: null;
}

interface LogoutError {
    status: number;
    message: string;
}

const STORE_LANGUAGE_KEY = "settings.lang";
export class StorageManager {
    static async setOnBoard(flag: boolean) {
        try {
            EncryptedStorage.setItem("onboard", JSON.stringify(flag));
        } catch (error) {
            return null;
        }
    }
    static async getOnBoard() {
        try {
            const flag: string | null | undefined | boolean = await EncryptedStorage.getItem("onboard");
            if (!flag) return false;
            if (isJsonString(flag)) {
                return JSON.parse(flag)
            };
            return false;
        } catch (error) {
            return false;
        }
    }

    static async setToken(token: string) {
        try {
            EncryptedStorage.setItem("token", JSON.stringify(token));
        } catch (error) {
            return null;
        }
    }
    static async getToken() {
        try {
            const token: string | null | undefined = await EncryptedStorage.getItem("token");
            if (!token) return null;
            if (isJsonString(token)) {
                return JSON.parse(token)
            };
            return null;
        } catch (error) {
            return null;
        }
    }

    static async setNotificationSetting(data: INotificationSound) {
        try {
            EncryptedStorage.setItem("notification", JSON.stringify(data));
        } catch (error) {
            return null;
        }
    };
    static async getNotificationSetting(): Promise<INotificationSound | null> {
        try {
            const notification: string | null | undefined = await EncryptedStorage.getItem("notification");
            if (!notification) return null;
            if (isJsonString(notification)) {
                return JSON.parse(notification)
            };
            return null;
        } catch (error) {
            return null;
        }
    };


    static async appLogout(): Promise<LogoutResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await EncryptedStorage.removeItem("token");
                return resolve({
                    status: 200,
                    message: "Successfully logged out.",
                    data: null
                })
            } catch (error) {
                return reject({
                    status: 400,
                    message: "Unable to logged out"
                } as LogoutError)
            }
        })
    }

    static async removeItems() {
        await EncryptedStorage.clear();
    }
}
