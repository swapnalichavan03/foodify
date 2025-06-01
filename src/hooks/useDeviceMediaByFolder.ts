import { useEffect, useLayoutEffect, useState } from "react"
import { Alert, Linking, NativeModules, Platform } from "react-native";
import { PERMISSIONS } from "react-native-permissions";
import { checkMultiplePermissions, PermissionResult, requestMultiplePermissions } from "../helpers/permissions";

export interface IImage {
  "creationDate": number,
  "data": null,
  "mime": string,
  "sourceURL": string,
  "duration": null,
  "size": number,
  "filename": string,
  "height": number,
  "exif": null,
  "localIdentifier": string,
  "width": number,
  "path": string,
  "modificationDate": number
}
export interface IFolder {
  folderIdentifier: string,
  thumbnail: string,
  imageCount: number,
  folderName: string,
  folderPath: string,
}

const { ImageFolders } = NativeModules;
export const useDeviceMediaByFolder = () => {
  const [folders, setFolders] = useState<IFolder[]>([])
  const [media, setMedia] = useState<IImage[]>([]);
  const [loading, setLoading] = useState<true | false>(false);
  const [isPermissions, setIsPermissions] = useState<true | false>(false);
  const [pageInfo, setPageInfo] = useState<{
    page_info: {
      has_next_page: boolean;
      start_cursor?: string;
      end_cursor?: string;
    };
  }>({
    page_info: {
      has_next_page: false,
      start_cursor: "",
      end_cursor: "",
    }
  });
  
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

  useLayoutEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        const permissions = await hasPermissions()
        setIsPermissions(permissions as boolean)
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const folders = await ImageFolders.getImageFolders();
        if (Array.isArray(folders) && folders.length) {
          setFolders(folders)
          // getMedia({

          // })
        } else {
          // getMedia({

          // })
        }
      } catch (error) {
        setFolders([])
        // getMedia({

        // })
        console.log("error.getAlbums", error)
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // const folders = await ImageFolders.getMediaFolders()
        // console.log(JSON.stringify(folders))
        const medias = await ImageFolders.getMediaByFolder({
          // first: 5,
          // after: "FC782848-049A-47E9-AFD3-1DB6F53A4316/L0/001"
          // folderPath: "/storage/emulated/0/FMWhatsApp/Media/FMWhatsApp Images"
          folderPath: "B7E15F49-DEA0-4D93-8B73-AF11D689D2B0/L0/0400"
        })
        console.log(JSON.stringify(medias))
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const getMedia = async ({ folder, after, }: { folder?: string, after?: string, }) => {
    if (loading) return
    setLoading(true)

    try {

      const images = await ImageFolders.getImagesByFolder({
        first: 30,
        ...(after && { after: after, }),
        ...(folder && { folderPath: folder }),
      });

      setPageInfo({
        page_info: {
          has_next_page: images.page_info.has_next_page,
          start_cursor: images.page_info.start_cursor,
          end_cursor: images.page_info.end_cursor,
        }
      })

      if (after !== undefined) {
        setMedia((prev) => [...prev, ...images.images])
      } else {
        setMedia(images.images)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setMedia([])

    }
  };

  return { media, folders, pageInfo, getMedia, loading }
}