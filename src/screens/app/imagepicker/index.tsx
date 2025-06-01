import React, { Fragment, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { ActivityIndicator, Alert, Dimensions, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import type { PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { Gesture, GestureDetector, GestureHandlerRootView, PinchGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'
import type { CameraProps, CameraRuntimeError, PhotoFile, VideoFile } from 'react-native-vision-camera'
import {
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  useLocationPermission,
  useMicrophonePermission,
  useCameraPermission,
  Templates,
} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants/layout'
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useIsForeground } from '../../../hooks/useIsForeground'
import { CaptureButton } from '../../../components/capturebutton'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { usePreferredCameraDevice } from '../../../hooks/usePreferredCameraDevice'
import { examplePlugin } from '../../../helpers/frameprocessors/ExamplePlugin'
import { exampleKotlinSwiftPlugin } from '../../../helpers/frameprocessors/ExampleKotlinSwiftPlugin'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '../../../utils/linking'
import { colors } from '../../../theme/colors'
import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import { hexToRgb } from '../../../utils/hexToRgb'
import ImageCropPicker from 'react-native-image-crop-picker';
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setAddRecipeData, setIngredientImage, setIngredientsData, setInstructionImage, setInstructionsData, setRecipeType } from '../../../store/reducers/createrecipe'
import CustomeGallery from '../../../components/customegallery'
import { useDeviceFlash } from '../../../modules/deviceflash'
import { uploadImage } from '../../../uploader/uploadImage'
import { imagesize } from '../../../utils/imagesize'
import { setProfileImage } from '../../../store/reducers/userprofile'
import { cloudpreset } from '../../../utils/cloudpreset'
import { setReviewImage } from '../../../store/reducers/recipereview'
import { checkMultiplePermissions, PermissionResult, requestMultiplePermissions } from '../../../helpers/permissions'
import { PERMISSIONS } from 'react-native-permissions'
import LinearProgress from '../../../components/linearprogress'

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const { width, height } = Dimensions.get("screen")
const SCALE_FULL_ZOOM = 3
type navigationProps = NativeStackNavigationProp<RootStackParamList, "camera/picker/image">
type routeProps = RouteProp<RootStackParamList, "camera/picker/image">
const ImagePicker = () => {
  const { onDeviceFlash } = useDeviceFlash()
  const dispatch = useAppDispatch();
  const navigation = useNavigation<navigationProps>()
  const { params } = useRoute<routeProps>()
  const insets = useSafeAreaInsets();
  const camera = useRef<Camera>(null);
  const [onRender, setOnRender] = useState(false)
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [openGallery, setOpenGallery] = useState<true | false>(false);
  const [isPermissions, setIsPermissions] = useState<true | false>(false);
  // const microphone = useMicrophonePermission()
  // const location = useLocationPermission()
  // const camerapermission = useCameraPermission()
  const zoom = useSharedValue(1);
  const isPressingButton = useSharedValue(false);
  const [onProgress, setOnProgress] = useState<number>(0);

  // check if camera page is active
  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back')
  const [enableHdr, setEnableHdr] = useState(false)
  const [flash, setFlash] = useState<'off' | 'on' | 'auto' | 'fill'>('off')
  const [isDHR, setIsHDR] = useState<true | false>(false)
  const [enableNightMode, setEnableNightMode] = useState(false)

  // camera device settings
  const [preferredDevice] = usePreferredCameraDevice()
  let device = useCameraDevice(cameraPosition)

  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    // override default device with the one selected by the user in settings
    device = preferredDevice
  }

  const [targetFps, setTargetFps] = useState(60)

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
    { photoHdr: isDHR },
    { videoHdr: isDHR }
  ])

  const fps = Math.min(format?.maxFps ?? 1, targetFps)

  const supportsFlash = device?.hasFlash ?? false
  const supportsHdr = format?.supportsPhotoHdr
  const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats])
  const canToggleNightMode = device?.supportsLowLightBoost ?? false

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
    return {
      zoom: z,
    }
  }, [maxZoom, minZoom, zoom])
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton
    },
    [isPressingButton],
  )
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error)
  }, [])
  const onInitialized = useCallback(() => {
    // console.log('Camera initialized!')
    setIsCameraInitialized(true)
  }, [])

  const onMediaCaptured = useCallback(async () => {
    const photo = await camera?.current?.takePhoto({
      // ...(flash !== "fill" && { flash: flash }),
      flash: flash as "on" | "off" | "auto",
      enableAutoRedEyeReduction: false,
      enableShutterSound: true,
      enableAutoDistortionCorrection: false,
    });
    ImageCropPicker.openCropper({
      mediaType: "photo",
      path: `file:///${photo?.path}` as string, // Path from Vision Camera
      width: imagesize[params.name].width, // Target width
      height: imagesize[params.name].height, // Target height
    })
      .then((editedPhoto) => {
        const fileName = editedPhoto?.path.split('/').pop();
        setOnProgress(10)
        uploadImage({
          uri: editedPhoto?.path as string,
          type: editedPhoto?.mime as string,
          name: fileName as string,
          preset: cloudpreset[params.name]
        }, setOnProgress)
          .then((response) => {
            if (params.name === "recipe") {
              dispatch(setAddRecipeData({
                name: "images",
                value: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: response?.secure_url as string,
                  size: response?.bytes as number,
                  type: response?.resource_type as string,
                }
              }))
            } else if (params.name === "ingredients") {
              dispatch(setIngredientImage({
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: response?.secure_url as string,
                  size: response?.bytes as number,
                  type: response?.resource_type as string,
                }
              }))
            } else if (params.name === "instructions") {
              dispatch(setInstructionImage({
                name: "images",
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: response?.secure_url as string,
                  size: response?.bytes as number,
                  type: response?.resource_type as string,
                }
              }))
            } else if (params.name === "profile") {
              dispatch(setProfileImage({ image: response?.secure_url as string, }))
            } else if (params.name === "appliances") {
              dispatch(setRecipeType({
                name: "image",
                value: {
                  title: "",
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  image: {
                    _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                    url: response?.secure_url as string,
                    size: response?.bytes as number,
                    type: response?.resource_type as string,
                  }
                }
              }))
            } else if (params.name === "review") {
              dispatch(setReviewImage({
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: response?.secure_url as string,
                  size: response?.bytes as number,
                  type: response?.resource_type as string,
                  fileName: fileName as string
                }
              }))
            }
            navigation.goBack()

          })
          .catch((error) => {
            console.log("error.uploadimage", error)
          })
          .finally(() => { setOnProgress(0) })

      })
      .catch((error) => {
        console.error('Error cropping photo:', error);
      });
  },
    [])

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
  }, []);
  //#endregion

  //#region Tap Gesture
  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      })
    },
    [device?.supportsFocus],
  )
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed()
  }, [onFlipCameraPressed])
  //#endregion

  //#region Effects
  useEffect(() => {
    // Reset zoom to it's default everytime the `device` changes.
    zoom.value = device?.neutralZoom ?? 1
  }, [zoom, device])
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP)
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP)
    },
  })
  //#endregion

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined
    // console.log(`Camera: ${device?.name} | Format: ${f}`)
  }, [device?.name, format, fps])

  // useEffect(() => {
  //   location.requestPermission()
  //   microphone.requestPermission()
  //   camerapermission.requestPermission()
  // }, [location, microphone, camerapermission]);


  const hasPermissions = async () => new Promise(async (resolve) => {
    let permissions = [];

    if (Platform.OS === 'android') {
      if (Platform.Version > 33) {
        permissions = [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO];
      } else {
        permissions = [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO];
      }
    } else {
      permissions = [PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.CAMERA];
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
            style: "cancel",
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
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const result = await CameraRoll.getPhotos({
          first: 1,
          groupTypes: 'All',
          assetType: "Photos",

        });
        setPhotos(result.edges.map((edge) => edge as PhotoIdentifier));
      } catch (error) {
        console.log("getPhotos.error", error)
      }
    })()
  }, [isPermissions]);

  useEffect(() => {
    if (onRender) return
    setTimeout(() => {
      setOnRender(true)
    }, 1000);
  }, [openGallery])

  if (!onRender) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} color={colors.success.dark} />
      </View>
    )
  }

  const handleFocusOnTap = async (tapEvent) => {
    try {
      if (device?.supportsFocus && camera && tapEvent && tapEvent.x !== undefined && tapEvent.y !== undefined) {

        await camera?.current?.focus({
          x: tapEvent.x,
          y: tapEvent.y
        });
        console.log(tapEvent.x, tapEvent.y)
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tap = Gesture.Tap().onEnd((event, success) => {
    const focusAsync = async () => {
      await handleFocusOnTap(event);
    };
    if (success) {
      focusAsync();
    } else {
      console.error()
    }
  });

  return (
    <Fragment>
      {!openGallery &&
        <GestureHandlerRootView>
          <View style={styles.container} >
            {device != null ? (
              <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive} >
                <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill} >
                  <TapGestureHandler onGestureEvent={() => { }} onEnded={onDoubleTap} numberOfTaps={2} >
                    {/* <GestureDetector gesture={tap}> */}
                    <ReanimatedCamera
                      style={StyleSheet.absoluteFill}
                      device={device}
                      isActive={isActive}
                      ref={camera}
                      onInitialized={onInitialized}
                      onError={onError}
                      onStarted={() => {
                        // console.log('Camera started!')
                      }}
                      onStopped={() => {
                        // console.log('Camera stopped!')
                      }}
                      onPreviewStarted={() => {
                        // console.log('Preview started!')
                      }}
                      onPreviewStopped={() => {
                        // console.log('Preview stopped!')
                      }}
                      onOutputOrientationChanged={(o) => {
                        // console.log(`Output orientation changed to ${o}!`)
                      }}
                      onPreviewOrientationChanged={(o) => {
                        // console.log(`Preview orientation changed to ${o}!`)
                      }}
                      onUIRotationChanged={(degrees) => {
                        // console.log(`UI Rotation changed: ${degrees}°`)
                      }}
                      format={format}
                      fps={fps}
                      pixelFormat={"yuv"}
                      photoHdr={format?.supportsPhotoHdr}
                      videoHdr={format?.supportsVideoHdr}
                      photoQualityBalance="quality"
                      torch={flash === "fill" ? "on" : "off"}
                      lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                      enableZoomGesture={true}
                      animatedProps={cameraAnimatedProps}
                      exposure={0}
                      enableFpsGraph={false}
                      outputOrientation="device"
                      photo={true}
                      video={true}
                      focusable={true}
                    // audio={microphone.hasPermission}
                    // enableLocation={location.hasPermission}
                    // frameProcessor={frameProcessor}
                    />
                    {/* </GestureDetector> */}
                  </TapGestureHandler>
                </Reanimated.View>
              </PinchGestureHandler>
            ) : (
              <View style={styles.emptyContainer} >
                <Text style={styles.text}> Your phone does not have a Camera.</Text>
              </View>
            )}


            <View style={{ backgroundColor: hexToRgb(colors.common.black, .3), position: "absolute", bottom: 0, paddingTop: 25, paddingBottom: (insets.bottom + 40), width: "100%", paddingHorizontal: 15, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 35 }}>
              {photos.length && params.name !== "review" ?
                <Pressable onPress={() => setOpenGallery(!openGallery)} style={{ width: 45, height: 45, borderRadius: (45 / 2), overflow: "hidden", borderWidth: 1, borderColor: colors.grey[400], borderStyle: "solid", alignItems: "center", justifyContent: "center" }}>
                  <Image source={{ uri: photos[0].node.image.uri }} resizeMode="cover" style={{ width: 45, height: 45, }} />
                </Pressable>
                :
                <Pressable style={{ width: 45, height: 45, borderRadius: (45 / 2), overflow: "hidden", alignItems: "center", justifyContent: "center" }}>

                </Pressable>
              }

              <Pressable onPress={() => onMediaCaptured()} style={{ width: 60, height: 60, borderRadius: (60 / 2), borderWidth: 6, borderColor: colors.grey[400], borderStyle: "solid" }}></Pressable>

              {params.name === "profile" ?
                <Pressable onPress={() => { onFlipCameraPressed() }} style={{ width: 45, height: 45, borderRadius: (45 / 2), borderWidth: 0, borderColor: colors.grey[400], borderStyle: "solid", alignItems: "center", justifyContent: "center" }}>
                  <MaterialCommunityIcons name={"camera-party-mode"} color={colors.common.white} size={32} />
                </Pressable>
                :
                <Pressable style={{ width: 45, height: 45, borderRadius: (45 / 2), borderWidth: 0, borderColor: colors.grey[400], borderStyle: "solid", alignItems: "center", justifyContent: "center" }} />
              }
            </View>


            <View style={{ backgroundColor: hexToRgb(colors.common.black, .4), width: 38, height: 38, borderRadius: (38 / 2), position: "absolute", top: (insets.top + 5), left: 15, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 35 }}>
              <Pressable onPress={() => { navigation.goBack() }} style={{ alignItems: "center", justifyContent: "center", width: 35, height: 35, borderRadius: 12 }}>
                <AntDesign name='arrowleft' color={colors.common.white} size={20} />
              </Pressable>
            </View>
            <View style={{ backgroundColor: hexToRgb(colors.common.black, .4), borderRadius: (38 / 2), width: 40, height: 130, paddingVertical: 5, position: "absolute", top: (insets.top + 5), right: 15, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", }}>
              <Pressable onPress={() => { }} style={{ alignItems: "center", justifyContent: "center", width: 35, height: 35, borderRadius: (35 / 2) }}>
                <Feather name='settings' color={colors.common.white} size={20} />
              </Pressable>

              <Pressable onPress={() => {
                setFlash(
                  flash === "off" ? "on" : flash === "on" ? "auto" : flash === "auto" ? "fill" : "off"
                )
              }} style={{ alignItems: "center", justifyContent: "center", width: 35, height: 35, borderRadius: (35 / 2) }}>
                <MaterialCommunityIcons name={flash === "off" ? 'flash-off' : flash === "on" ? "flash" : flash === "auto" ? "flash-auto" : flash === "fill" ? "flash-red-eye" : "flash-off"} color={colors.common.white} size={20} />
              </Pressable>

              <Pressable onPress={() => { setIsHDR(!isDHR) }} style={{ alignItems: "center", justifyContent: "center", width: 35, height: 35, borderRadius: (35 / 2) }}>
                <MaterialCommunityIcons name={isDHR ? 'hdr' : "hdr-off"} color={colors.common.white} size={20} />
              </Pressable>
            </View>

          </View>
        </GestureHandlerRootView>
      }

      {openGallery &&
        <CustomeGallery
          onSelectedImage={(image) => {
            if (params.name === "recipe") {
              dispatch(setAddRecipeData({
                name: "images",
                value: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: image?.filePath as string,
                  size: image?.fileSize as number,
                  type: image?.fileType as string,
                  fileName: image?.fileName as string
                }
              }))
            } else if (params.name === "ingredients") {
              dispatch(setIngredientImage({
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: image?.filePath as string,
                  size: image?.fileSize as number,
                  type: image?.fileType as string,
                  fileName: image?.fileName as string
                }
              }))
            } else if (params.name === "instructions") {
              dispatch(setInstructionImage({
                name: "images",
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: image?.filePath as string,
                  size: image?.fileSize as number,
                  type: image?.fileType as string,
                  fileName: image?.fileName as string
                }
              }))
            } else if (params.name === "profile") {
              dispatch(setProfileImage({ image: image?.filePath }))
            } else if (params.name === "appliances") {
              dispatch(setRecipeType({
                name: "image",
                value: {
                  title: "",
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  image: {
                    _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                    url: image?.filePath as string,
                    size: image?.fileSize as number,
                    type: image?.fileType as string,
                    fileName: image?.fileName as string
                  }
                }
              }))
            } else if (params.name === "review") {
              dispatch(setReviewImage({
                image: {
                  _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}`),
                  url: image?.filePath as string,
                  size: image?.fileSize as number,
                  type: image?.fileType as string,
                  fileName: image?.fileName as string
                }
              }))
            }
            navigation.goBack()
          }}
          visible={openGallery} // openGallery
          onRequestClose={() => { setOpenGallery(!openGallery) }}
        />
      }

      {onProgress !== 0 &&
        <View
          style={[StyleSheet.absoluteFill]}
        >
          <View style={{ paddingTop: insets.top, alignItems: "center", backgroundColor: colors.common.backdrop, height: height, width: width }}>
            <LinearProgress progress={onProgress} />
          </View>
        </View>
      }
    </Fragment>
  )
}

export default ImagePicker

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hexToRgb(colors.grey[100], .1),
    // backgroundColor: "#000000"
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


// import React, { Fragment } from 'react';

// const ImagePicker = () => {
//   return (
//     <Fragment></Fragment>
//   );
// }

// export default ImagePicker;
