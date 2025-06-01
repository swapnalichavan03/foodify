import React, { Fragment } from 'react'
import { Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import TextField from '../../../components/textfield'
import Button from '../../../components/button'
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { facebookicon, iconsgoogle } from '../../../assets/icons/bold'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "auth/signup">;
const SignUp = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <Fragment>
      <KeyboardAvoidingView style={{ flexGrow: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 100, paddingHorizontal: 15, flex: 1, justifyContent: "center" }}
        >
          <View style={{ gap: 20 }}>
            <View style={{ paddingBottom: 12 }}>
              <Typography variant="HeaderTextBold">
                Create an account,
              </Typography>
              <Typography variant="SmallTextRegular">
                Let's help you set up your account,{`\n`}it won't take long.
              </Typography>
            </View>

            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Email"
              lable={"Email"}
            />
            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Email"
              lable={"Email"}
            />
            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Email"
              lable={"Email"}
            />
            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Password"
              lable={"Enter Password"}
            />

            <Button >
              Sign Up
            </Button>
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
              <View style={{ width: 80, height: 1, borderRadius: .5, backgroundColor: colors.grey[400] }} />
              <Typography color={colors.grey[400]} variant="SmallerTextSemiBold">Or Sign in With</Typography>
              <View style={{ width: 80, height: 1, borderRadius: .5, backgroundColor: colors.grey[400] }} />
            </View>
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 20 }}>
              <TouchableOpacity activeOpacity={0.6} style={{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.common.white }}>
                <SvgXml xml={iconsgoogle} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.common.white }}>
                <SvgXml xml={facebookicon} />
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

        <View style={{ paddingVertical: 10, display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
          <Typography variant="SmallerTextSemiBold">Already a member?</Typography>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.goBack() }}>
            <Typography color={colors.primary.main} variant="SmallerTextSemiBold">
              Sign In
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Fragment>
  )
}

export default SignUp
