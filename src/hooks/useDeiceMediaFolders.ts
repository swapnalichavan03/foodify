import { useEffect, useState } from "react"
import { CameraRoll, type Album, type AssetType, type AlbumType } from "@react-native-camera-roll/camera-roll"
import { Alert, Linking, NativeModules, Platform } from "react-native";
import { PERMISSIONS } from "react-native-permissions";
import { checkMultiplePermissions, PermissionResult, requestMultiplePermissions } from "../helpers/permissions";

export interface IFolder {
    folderIdentifier: string,
    thumbnail: string,
    imageCount: number,
    folderName: string,
    folderPath: string,
}
const { ImageFolders } = NativeModules;
export const useDeiceMediaFolders = ({ assetType = "All", albumType = "All" }: { assetType?: AssetType, albumType?: AlbumType }) => {
    const [folders, setFolders] = useState<IFolder[]>([])

    const hasPermissions = async () => new Promise(async (resolve) => {
        let permissions = [];

        if (Platform.OS === 'android') {
            if (Platform.Version > 33) {
                permissions = [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO];
            } else {
                permissions = [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
            }
        } else {
            permissions = [PERMISSIONS.IOS.PHOTO_LIBRARY];
        }

        const showSettingsAlert = () => {
            Alert.alert(
                'Foodify',
                'Permission required to fetch images and videos',
                [
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            void Linking.openSettings();
                        },
                        style: 'default',
                    },
                ],
            );
        };

        const checkPermissionRes = await checkMultiplePermissions(permissions);
        switch (checkPermissionRes) {
            case PermissionResult.GRANTED:
                resolve(true);
                break;
            case PermissionResult.DENIED: {
                const requestPermissionRes = await requestMultiplePermissions(permissions);
                switch (requestPermissionRes) {
                    case PermissionResult.GRANTED:
                        resolve(true);
                        break;
                    default:
                        showSettingsAlert();
                }
            }
                break;
            default:
                showSettingsAlert();
        }
    });

    useEffect(() => {
        (async () => {
            try {
                const permissionRes = await hasPermissions();
                if (!permissionRes) {
                    return;
                }

                const folders = await ImageFolders.getImageFolders();
                if (Array.isArray(folders) && folders.length) {
                    setFolders(folders)
                }
            } catch (error) {
                setFolders([])
                console.log("error.getAlbums", error)
            }
        })()
    }, [])

    return { folders }
}