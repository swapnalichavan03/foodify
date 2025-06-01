import React, { Fragment, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hexToRgb } from '../../../utils/hexToRgb';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import BottomSheet from '../../../components/bottomsheet';
import { appleIcon, facebookIcon, googleIcon, instagramIcon } from '../../../assets/auth';
import { onGoogleSignIn } from '../../../providers/googlelogin';

type navigationProp = NativeStackNavigationProp<RootStackParamList, "auth/signin/method">
const LoginMethod = () => {
  const navigation = useNavigation<navigationProp>()
  const insets = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState<true | false>(false)
  const [isMethod, setIsMethod] = useState<true | false>(false)

  const icons = {
    "google": <AntDesign name='google' size={18} color={colors.grey[600]} />,
    "apple": <AntDesign name='apple1' size={18} color={colors.grey[600]} />,
    "facebook": <AntDesign name='facebook-square' size={18} color={colors.grey[600]} />,
    "instagram": <AntDesign name='instagram' size={18} color={colors.grey[600]} />,
    "mobile": <AntDesign name='mobile1' size={18} color={colors.grey[600]} />,
    "email": <MaterialIcons name='alternate-email' size={18} color={colors.grey[600]} />,
  }

  const onOptionClick = (_id: "google" | "apple" | "facebook" | "instagram" | "mobile" | "email") => {
    switch (_id) {
      case "google":
        return onGoogleSignIn()
      case "apple":
        return Alert.alert("apple in progress")
      case "facebook":
        return Alert.alert("facebook in progress")
      case "instagram":
        return Alert.alert("instagram in progress")
      case "mobile":
        return Alert.alert("mobile in progress")
      case "email":
        navigation.navigate("auth/signin")
      default:
        break;
    }
    setIsVisible(false)
  };

  return (
    <Fragment>
      {/* <StatusBar translucent={true} barStyle={"light-content"} backgroundColor={colors.common.transparent} /> */}
      <Video
        source={require("../../../assets/video/loginmethodvideo.mp4")}
        resizeMode="cover"
        muted
        repeat
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
      <View
        style={{ position: "absolute", backgroundColor: hexToRgb(colors.common.black, .4), height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}
      >
        <View style={{ padding: 20, gap: 20, position: "absolute", overflow: "hidden", borderRadius: 12, paddingHorizontal: 20, bottom: insets.bottom || 10, width: Dimensions.get("screen").width - 40, alignSelf: "center" }}>
          <BlurView
            blurAmount={1}
            blurType="dark"
            style={StyleSheet.absoluteFill}
          />

          <View>
            <Typography variant="LargeTextSemiBold" color={colors.common.white} styles={{ textAlign: "center" }}>
              Explore and cook
            </Typography>
            <Typography variant="LargeTextSemiBold" color={colors.common.white} styles={{ textAlign: "center" }}>
              Eat and joy
            </Typography>
          </View>
          <View>
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
              <View style={{ flex: 1, height: 1, borderRadius: .5, backgroundColor: colors.grey[400] }} />
              <Typography color={colors.common.white} variant="SmallerTextSemiBold">Sign in With</Typography>
              <View style={{ flex: 1, height: 1, borderRadius: .5, backgroundColor: colors.grey[400] }} />
            </View>
          </View>
          <View style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
            {Platform.OS === "android" &&
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { onGoogleSignIn() }} activeOpacity={0.6} style={{ width: "100%", height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.common.white }}>
                  <Image source={googleIcon} resizeMode="contain" style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>
            }
            {Platform.OS === "ios" &&
              <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={0.6} style={{ width: "100%", height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.common.white }}>
                  <Image source={appleIcon} resizeMode="contain" style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>
            }
            <View style={{ flex: 1 }}>
              <TouchableOpacity activeOpacity={0.6} style={{ width: "100%", height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.common.white }}>
                <Image source={instagramIcon} resizeMode="contain" style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => { setIsVisible(true) }} activeOpacity={.60} style={{ alignSelf: "center", display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Typography variant="SmallerTextSemiBold" color={colors.primary.main}>
              Other sign-in options
            </Typography>
            <Feather name='chevron-right' color={colors.primary.main} size={16} />
          </TouchableOpacity>
          <View style={{ gap: 5 }}>
            <Typography variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3} styles={{ textAlign: 'center' }}>
              By using Foodify, you agree to accept our
            </Typography>

            <View style={{ gap: 2, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Typography onPress={() => { }} variant="SmallerTextBold" color={colors.neturalcolour.gray_3} styles={{ textAlign: 'center', textDecorationColor: colors.primary.main, textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                Terms of Use
              </Typography>
              <Typography variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3} styles={{ textAlign: 'center' }}>
                &
              </Typography>
              <Typography onPress={() => { }} variant="SmallerTextBold" color={colors.neturalcolour.gray_3} styles={{ textAlign: 'center', textDecorationColor: colors.primary.main, textDecorationLine: "underline", textDecorationStyle: "solid" }}>
                Privacy Policy
              </Typography>
            </View>
          </View>
        </View>
      </View>

      <BottomSheet
        visible={isVisible}
        onCancel={() => { setIsVisible((prev: true | false) => !prev) }}
        title="Login options"
      >
        <FlatList
          data={options}
          renderItem={({ item }: { item: IOptions }) => {
            return (
              <TouchableOpacity onPress={() => { onOptionClick(item._id) }} activeOpacity={0.70} style={{ paddingVertical: 15, display: "flex", flexDirection: "row", alignItems: 'center', gap: 10 }}>
                {icons[item._id]}
                <Typography variant="SmallTextSemiBold">{item.name}</Typography>
              </TouchableOpacity>
            )
          }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 10 }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.grey[300] }} />
          )}
        />
      </BottomSheet>
    </Fragment>
  );
}

export default LoginMethod;

interface IOptions {
  _id: "google" | "apple" | "facebook" | "instagram" | "mobile" | "email",
  name: "Google" | "Apple" | "Facebook" | "Instagram" | "Mobile" | "Email",
}

const options: IOptions[] = Platform.select({
  "ios": [
    {
      _id: "google",
      name: "Google"
    },
    {
      _id: "apple",
      name: "Apple"
    },
    {
      _id: "facebook",
      name: "Facebook"
    },
    {
      _id: "instagram",
      name: "Instagram"
    },
    {
      _id: "mobile",
      name: "Mobile"
    },
    {
      _id: "email",
      name: "Email"
    },
  ],
  "android": [
    {
      _id: "google",
      name: "Google"
    },
    {
      _id: "facebook",
      name: "Facebook"
    },
    {
      _id: "instagram",
      name: "Instagram"
    },
    {
      _id: "mobile",
      name: "Mobile"
    },
    {
      _id: "email",
      name: "Email"
    },
  ]
}) ?? []