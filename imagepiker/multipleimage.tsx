import React, { Fragment, useEffect, useRef, useState } from 'react';
import { View, PermissionsAndroid, Platform, FlatList, TouchableOpacity, Image, Dimensions, Pressable, Modal, ScrollView, StatusBar, Alert } from 'react-native';
import { NativeModules } from 'react-native';
import Feather from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Typography from '../src/components/typography';
import { colors } from '../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../src/components/button';

const { width, height } = Dimensions.get("screen")
const { ImageFolders } = NativeModules;
const MultipleImage = ({ visible, onRequestClose }) => {
  const insets = useSafeAreaInsets();
  const [folders, setFolders] = useState<{ folderPath: string; folderName: string; imageCount: number }[]>([]);
  const [images, setImages] = useState([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewImages, setViewImages] = useState(false)
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    requestPermissionAndFetch();
  }, []);

  const requestPermissionAndFetch = async () => {
    if (Platform.OS === 'android') {
      const isAndroid12OrAbove = Platform.Version >= 31;
      const granted = await PermissionsAndroid.request(
        Platform.Version >= 31 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      // console.log(isAndroid12OrAbove)
      // const granted = await PermissionsAndroid.request(
      //   isAndroid12OrAbove ?
      //     PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      //     :
      //     PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      // );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission denied');
        return;
      }
    }

    fetchImageFolders();
  };

  const fetchImageFolders = async () => {
    try {
      const result = await ImageFolders.getImageFolders();
      setFolders(result);
    } catch (error) {
      console.error('Error fetching image folders:', error);
    }
  };

  const fetchImagesByFolder = async (folderPath?: string) => {

    try {
      const images = await ImageFolders.getImagesByFolder(folderPath);
      // Alert.alert(String(images.length))
      setImages(images)
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImagesByFolder()
  }, []);

  const onSelectImage = (item) => {
    const findIndex = selectedImages.findIndex((image) => image?.path === item?.path)
    if (findIndex === -1) {
      setSelectedImages((prev) => {
        return [...prev, item]
      })
    } else {
      setSelectedImages((prev) => {
        prev = prev.filter((image) => image?.path !== item?.path)
        return [...prev]
      })
    }
  }

  const onScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page); // Update the current page
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={() => {
        if (onRequestClose) {
          onRequestClose()
          setSelectedImages([])
        }

      }}
    >
      <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: colors.common.white }}>
        {activeFile === "" &&
          <FlatList
            ListHeaderComponent={() => {
              return (
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Pressable
                    onPress={() => {
                      if (onRequestClose) {
                        onRequestClose()
                        setSelectedImages([])
                      }

                    }}
                  >
                    <AntDesign name='arrowleft' color={colors.grey[800]} size={20} />
                  </Pressable>
                  <Typography variant="MediumTextRegular">Go Back</Typography>
                </View>
              )
            }}
            showsHorizontalScrollIndicator={false}
            data={folders}
            renderItem={({ item, index }) => {

              return (
                <Fragment>
                  {index === 0 &&
                    <TouchableOpacity onPress={() => { setActiveFile(item.folderName); fetchImagesByFolder(item?.[Platform.OS === "ios" ? "folderIdentifier" : "folderPath"]) }} style={{ display: "flex", flexDirection: "row", gap: 10, height: 40, alignItems: "center", borderBottomWidth: .8, borderStyle: "solid", borderColor: colors.grey[400] }}>
                      <Typography variant="NormalTextSemiBold" color={activeFile === item.folderName ? colors.common.white : colors.grey[900]} styles={{ flex: 1 }}>
                        All
                      </Typography>
                      <Feather name='chevron-right' color={colors.grey[800]} size={22} />
                    </TouchableOpacity>
                  }
                  <TouchableOpacity onPress={() => { setActiveFile(item.folderName); fetchImagesByFolder(item?.[Platform.OS === "ios" ? "folderIdentifier" : "folderPath"]) }} style={{ display: "flex", flexDirection: "row", gap: 10, height: 40, alignItems: "center", }}>
                    <Typography variant="NormalTextSemiBold" color={activeFile === item.folderName ? colors.common.white : colors.grey[900]} styles={{ flex: 1 }}>
                      {item.folderName}
                    </Typography>
                    <Feather name='chevron-right' color={colors.grey[800]} size={22} />
                  </TouchableOpacity>
                </Fragment>
              )
            }}
            contentContainerStyle={{ marginVertical: 10, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: colors.common.white }}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grey[400] }} />}
          />
        }

        {activeFile !== "" &&
          <Fragment>
            <View style={{ marginVertical: 10, height: 40, paddingHorizontal: 15, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
              <TouchableOpacity onPress={() => { setActiveFile("") }} style={{ alignItems: "center", justifyContent: "center" }}>
                <Feather name='chevron-left' color={colors.grey[800]} size={22} />
              </TouchableOpacity>
              <Typography variant="NormalTextSemiBold" color={colors.grey[900]} styles={{ flex: 1 }}>
                {activeFile}
              </Typography>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={images}
              renderItem={({ item }) => {
                return (
                  <Pressable onPress={() => { onSelectImage(item) }} style={{ backgroundColor: colors.grey[400], display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", width: Dimensions.get("screen").width / 4, height: Dimensions.get("screen").width / 4, }}>
                    <View style={{ width: 40, height: 40, position: "absolute", zIndex: 999, top: 5, left: 5 }}>
                      <Ionicons name={selectedImages.findIndex((image) => image?.path === item?.path) === -1 ? 'radio-button-off' : "radio-button-on"} color={selectedImages.findIndex((image) => image?.path === item?.path) === -1 ? colors.grey[500] : colors.primary.dark} size={20} />
                    </View>
                    <Image source={{ uri: item?.[Platform.OS === 'ios' ? "sourceURL" : "path"] }} resizeMode="cover" style={{ width: "100%", height: "100%", }} />
                  </Pressable>
                )
              }}
              numColumns={4}
            />
          </Fragment>
        }

        {selectedImages.length !== 0 &&
          <View style={{ backgroundColor: colors.grey[200], }}>
            <View style={{ paddingVertical: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 }}>
              <TouchableOpacity onPress={() => { setViewImages(true) }}>
                <Typography variant="MediumTextRegular">View Selected Images</Typography>
              </TouchableOpacity>
              <Button
                onPress={() => {
                  Alert.alert(`${selectedImages.length} Image${selectedImages.length === 1 ? "" : "s"} selected`)
                }}
                variant="contain" size="tab">Add {selectedImages.length}</Button>
            </View>
            <View style={{ marginBottom: insets.bottom || 10 }} />
          </View>
        }


        <Modal
          visible={viewImages}
          onRequestClose={() => { setViewImages(false) }}
          transparent
          statusBarTranslucent
        >
          <View style={{ paddingTop: insets.top, paddingBottom: (insets.bottom), width: width, height: height, backgroundColor: colors.grey[300] }}>
            <View
              style={{ paddingHorizontal: 10, height: 30, justifyContent: "center", }}
            >
              <Feather onPress={() => { setViewImages(false) }} name='chevron-left' color={colors.grey[800]} size={20} />
            </View>
            <ScrollView
              pagingEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: colors.grey[200] }}
              onScroll={onScroll}
              scrollEventThrottle={16}
            >
              {selectedImages.map((image, index) => {
                return (
                  <View
                    key={index}
                    style={{ width: width, height: "100%", }}
                  >
                    <Image
                      source={{ uri: image?.[Platform.OS === 'ios' ? "sourceURL" : "path"] }}
                      resizeMode="contain"
                      style={{ width: "100%", height: "100%", }}
                    />
                  </View>
                )
              })}
            </ScrollView>
            {/* {selectedImages.length !== 1 &&
            <View style={{ gap: 5, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", alignSelf: "center", position: "absolute", bottom: (insets.bottom || insets.top) }}>
              {selectedImages.map((_, index) => {
                return (
                  <View
                    key={index}
                    style={{ width: 8, height: 8, borderRadius: (8 / 2), backgroundColor: currentPage === index ? colors.primary.main : colors.grey[400] }}
                  />
                )
              })}
            </View>
          } */}
          </View>
        </Modal>
      </View>
    </Modal>
  );
};


export default MultipleImage;
