import React, { Fragment, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs'
import { Album, CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import Octicons from "react-native-vector-icons/Octicons"
import ImageCropPicker from 'react-native-image-crop-picker';
import * as mime from "../../helpers/mime"
import { colors } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hexToRgb } from '../../utils/hexToRgb';
import { BlurView } from '@react-native-community/blur';
import Typography from '../typography';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../utils/linking';
import { uploadImage } from '../../uploader/uploadImage';
import { cloudpreset } from '../../utils/cloudpreset';
import { imagesize } from '../../utils/imagesize';
import { useDeviceMediaByFolder, type IImage } from '../../hooks/useDeviceMediaByFolder';
import { useDeiceMediaFolders, type IFolder } from '../../hooks/useDeiceMediaFolders';
import CircularProgress from '../circularprogress';
import LinearProgress from '../linearprogress';
import { PERMISSIONS } from 'react-native-permissions';
import { checkMultiplePermissions, PermissionResult, requestMultiplePermissions } from '../../helpers/permissions';

export interface ISelectedImages {
    "fileName": string,
    "filePath": string,
    "fileSize": number,
    "fileType": string,
}
interface galleryProps {
    onSelectedImage: (iamge: ISelectedImages | null) => void,
    visible: true | false,
    onRequestClose: () => void
}
const { width, height } = Dimensions.get("screen")
type routeProps = RouteProp<RootStackParamList, "camera/picker/image">
const CustomeGallery = ({ onSelectedImage, visible, onRequestClose }: galleryProps) => {
    const { params } = useRoute<routeProps>()
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<"Local" | "Assets">("Local")
    const [photo, setPhoto] = useState<IImage | null>(null);
    const { media, folders, pageInfo, getMedia, loading: isLoading } = useDeviceMediaByFolder()
    const [activeFolder, setActiveFolder] = useState<string>("All")
    const [onProgress, setOnProgress] = useState<number>(0);

    async function getFilePathFromUri(assetUri: string, mediaType: 'Photos' | 'Videos', fileName: string, width: number, height: number): Promise<{ filePath: string, fileType: string, fileName: string } | null> {
        try {
            // const fileName = "fileName";
            if (Platform.OS === 'ios') {
                // const filePath = `${RNFS.TemporaryDirectoryPath}${fileName}${mediaType === 'Photos' ? '.jpg' : '.mp4'}`;
                const filePath = `${RNFS.TemporaryDirectoryPath}${fileName}`;
                if (mediaType === 'Videos') {
                    await RNFS.copyAssetsVideoIOS(assetUri, filePath)
                        .then((res) => {
                            console.log('Asset copied successfully:', res);
                        })
                        .catch((err) => {
                            console.error('Error copying asset:', err);
                        });
                } else {
                    await RNFS.copyAssetsFileIOS(assetUri, filePath, width, height)
                        .then((res) => {
                            console.log('Asset copied successfully:', res);
                        })
                        .catch((err) => {
                            console.error('Error copying asset:', err);
                        });
                    // await RNFS.copyAssetsFileIOS(assetUri, filePath, 200, 200);
                }
                return {
                    filePath,
                    fileName,
                    fileType: mime.lookup(`${fileName}`) || '',
                };
            }
            if (Platform.OS === 'android') {
                const filePath = `file://${RNFS.ExternalDirectoryPath}/${fileName}`;
                await RNFS.copyFile(assetUri, filePath);
                return {
                    filePath,
                    fileName,
                    fileType: mime.lookup(`${fileName}`) || '',
                };
            }
        } catch (error) {
            console.error('Error accessing file path:', error);
            return null;
        }
        return null;
    }

    useEffect(() => {
        getMedia({
            ...(activeFolder !== "All" && { folder: activeFolder }),
        })
    }, []);


    const onSelectImage = (image: IImage) => {
        if (photo?.[Platform.OS === "ios" ? "sourceURL" : "path"] === image?.[Platform.OS === "ios" ? "sourceURL" : "path"]) {
            setPhoto(null)
        } else {
            setPhoto(image)
        }
    };

    const onNext = async () => {
        ImageCropPicker.openCropper({
            mediaType: "photo",
            path: Platform.OS === "ios" ? photo?.sourceURL as string : photo?.path as string, // Path from Vision Camera
            width: imagesize[params.name].width, // Target width
            height: imagesize[params.name].height, // Target height
        })
            .then((editedPhoto) => {
                const fileName = editedPhoto?.path.split('/').pop();
                setOnProgress(10)
                setTimeout(() => {
                    uploadImage({
                        uri: editedPhoto?.path as string,
                        type: editedPhoto?.mime as string,
                        name: fileName as string,
                        preset: cloudpreset[params.name]
                    }, setOnProgress)
                        .then((response) => {
                            onSelectedImage({
                                "fileName": fileName as string,
                                "filePath": response.secure_url as string,
                                "fileSize": response?.bytes as number,
                                "fileType": response?.resource_type as string,
                            })
                        })
                        .catch((error) => {
                            console.log("error.uploadimage", error);
                        })
                        .finally(() => { setOnProgress(0) })
                }, 2000);

            }).catch((error) => {
                console.error('Error cropping photo:', error);
            });
    };

    return (
        <Fragment>
            <Modal
                visible={visible}
                onRequestClose={onRequestClose}
                animationType="slide"
                // presentationStyle="pageSheet"
                transparent={true}
                statusBarTranslucent={true}
            >
                <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} />
                <View style={{ backgroundColor: colors.common.white, marginTop: insets.top, paddingVertical: Platform.OS === "ios" ? 20 : 20, paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <Typography variant="MediumTextSemiBold" styles={{ flex: 1 }}>Gallery</Typography>
                    {photo === null ?
                        <TouchableOpacity onPress={() => { onRequestClose() }} activeOpacity={0.60}>
                            <Typography variant="SmallTextSemiBold" color={colors.error.main}>Cancel</Typography>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => { onNext() }} activeOpacity={0.60}>
                            <Typography variant="SmallTextSemiBold" color={colors.primary.main}>Next</Typography>
                        </TouchableOpacity>
                    }
                </View>
                <View
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: colors.common.white }}
                >
                    <TouchableOpacity onPress={() => { setActiveTab("Local") }} disabled={activeTab === "Local"} activeOpacity={.70} style={{ paddingVertical: 10, flex: 1, alignItems: "center", borderBottomWidth: 3, borderColor: activeTab === "Local" ? colors.primary.main : colors.common.transparent, borderStyle: 'solid', }}>
                        <Typography variant="SmallTextSemiBold" color={activeTab === "Local" ? colors.primary.main : colors.grey[800]} >Local</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setActiveTab("Assets") }} disabled={activeTab === "Assets"} activeOpacity={.70} style={{ paddingVertical: 10, flex: 1, alignItems: "center", borderBottomWidth: 3, borderColor: activeTab === "Assets" ? colors.primary.main : colors.common.transparent, borderStyle: 'solid', }}>
                        <Typography variant="SmallTextSemiBold" color={activeTab === "Assets" ? colors.primary.main : colors.grey[800]} >Assets</Typography>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: colors.common.white }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 10, paddingVertical: 8, paddingHorizontal: 20, }}
                    >
                        {folders.map((value: IFolder, index: number) => {
                            return (
                                <Fragment key={index}>
                                    {index === 0 &&
                                        <TouchableOpacity onPress={() => { setActiveFolder("All"); getMedia({}) }} style={{ backgroundColor: activeFolder === "All" ? colors.primary.dark : colors.grey[300], paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 }}>
                                            <Typography variant="SmallerTextSemiBold" color={activeFolder === "All" ? colors.common.white : colors.grey[900]}>All</Typography>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity
                                        onPress={() => {
                                            setActiveFolder(value?.[Platform.OS === "android" ? "folderPath" : "folderIdentifier"]);
                                            getMedia({
                                                folder: value?.[Platform.OS === "android" ? "folderPath" : "folderIdentifier"],
                                            })
                                        }}
                                        style={{ backgroundColor: activeFolder === value?.[Platform.OS === "android" ? "folderPath" : "folderIdentifier"] ? colors.primary.dark : colors.grey[300], paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 }}>
                                        <Typography variant="SmallerTextSemiBold" color={activeFolder === value?.[Platform.OS === "android" ? "folderPath" : "folderIdentifier"] ? colors.common.white : colors.grey[900]}>{value.folderName} ({value.imageCount})</Typography>
                                    </TouchableOpacity>
                                </Fragment>
                            )
                        })}
                    </ScrollView>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: colors.grey[200] }}
                    contentContainerStyle={{ paddingBottom: insets.bottom || 10 }}
                    initialNumToRender={30}
                    data={media}
                    renderItem={({ item: value, index }: { item: IImage, index: number }) => {
                        return (
                            <TouchableOpacity onPress={() => { onSelectImage(value) }} activeOpacity={0.50} style={{ height: (Dimensions.get("screen").width / 3), width: (Dimensions.get("screen").width / 3), backgroundColor: colors.grey[300], alignItems: "center", justifyContent: "center" }}>
                                <Image source={{ uri: value.path }} resizeMode="cover" style={{ width: "100%", height: "100%", }} />
                                {photo?.[Platform.OS === "ios" ? "sourceURL" : "path"] === value?.[Platform.OS === "ios" ? "sourceURL" : "path"] &&
                                    <View style={{ position: "absolute", height: (Dimensions.get("screen").width / 3), width: Dimensions.get("screen").width / 3, backgroundColor: hexToRgb(colors.common.black, .1), alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ position: "absolute", height: (Dimensions.get("screen").width / 3), width: Dimensions.get("screen").width / 3, backgroundColor: hexToRgb(colors.common.black, .5), }} />
                                        <Octicons name='check' color={colors.common.white} size={30} />
                                    </View>
                                }
                            </TouchableOpacity>
                        )
                    }}
                    numColumns={3}
                    scrollEventThrottle={.5}
                    onEndReached={() => {
                        if (!pageInfo.page_info.has_next_page) return
                        getMedia({
                            ...(activeFolder !== "All" && { folder: activeFolder }),
                            after: pageInfo.page_info.end_cursor,
                        })
                    }}
                    ListFooterComponent={(() => {
                        return (
                            media.length !== 0 && isLoading ?
                                <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 30 }}>
                                    <ActivityIndicator size={"large"} color={colors.primary.main} />
                                </View>
                                :
                                media.length === 0 && isLoading &&
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                    {Array.from({ length: 30 }).map((_, index) => {
                                        return (
                                            <View key={index} style={{ width: Dimensions.get("screen").width / 3, height: Dimensions.get("screen").width / 3, alignItems: "center", justifyContent: "center" }}>
                                                <ActivityIndicator size={"small"} color={colors.primary.main} />
                                            </View>
                                        )
                                    })}
                                </View>
                        )
                    })}
                />
                {onProgress !== 0 &&
                    <View
                        style={[StyleSheet.absoluteFill]}
                    >
                        <View style={{ paddingTop: insets.top, alignItems: "center", backgroundColor: colors.common.backdrop, height: height, width: width }}>
                            <LinearProgress progress={onProgress} />
                        </View>
                    </View>
                }
            </Modal>
        </Fragment>
    )
}

export default CustomeGallery
