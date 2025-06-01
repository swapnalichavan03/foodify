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
const SingleImage = ({ visible, onRequestClose }) => {
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
                  <Pressable onPress={() => { Alert.alert("1 image selected") }} style={{ backgroundColor: colors.grey[400], display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", width: Dimensions.get("screen").width / 4, height: Dimensions.get("screen").width / 4, }}>
                    <Image source={{ uri: item?.[Platform.OS === 'ios' ? "sourceURL" : "path"] }} resizeMode="cover" style={{ width: "100%", height: "100%", }} />
                  </Pressable>
                )
              }}
              numColumns={4}
            />
          </Fragment>
        }
      </View>
    </Modal>
  );
};

export default SingleImage;
