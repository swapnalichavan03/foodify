import React, { Fragment, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import TextField from '../../../components/textfield'
import Button from '../../../components/button'
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { facebookicon, iconsgoogle } from '../../../assets/icons/bold'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking'
import TostMessage from '../../../components/toastmessage'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "auth/signin">;
const Forgotpassword = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Fragment>
      <KeyboardAvoidingView style={{ flex: 1, }} behavior="height" keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 100, paddingHorizontal: 15, flex: 1, justifyContent: "center" }}
        >
          <View style={{ gap: 20, }}>
            <View style={{ paddingBottom: 12 }}>
              <Typography variant="HeaderTextBold">
                Forgot Password,
              </Typography>
              <Typography variant="LargeTextRegular">
                Enter your credentials to continue
              </Typography>
            </View>

            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Password"
              lable={"Enter Password"}
            />
            <TextField
              onFocus={() => { console.log("onFocus") }}
              onBlur={() => { console.log("onBlur") }}
              onPress={() => { console.log("onPress") }}
              onPressIn={() => { console.log("onPressIn") }}
              placeholder="Enter Password"
              lable={"Enter Password"}
            />

            <Button onPress={() => { }}>
              Forgot Password
            </Button>
          </View>

        </ScrollView>
        <View style={{ paddingVertical: 10, display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.navigate("auth/signin") }}>
            <Typography color={colors.primary.main} variant="SmallerTextSemiBold">
              {`<`} Back to login
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TostMessage
        message="This is a sliding toast!"
        visible={false}
        onHide={() => { }}
      />
    </Fragment>
  )
}

export default Forgotpassword
