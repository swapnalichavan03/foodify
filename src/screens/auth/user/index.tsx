import React, { Fragment, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import TextField from '../../../components/textfield'
import Button from '../../../components/button'
import Typography from '../../../components/typography'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import { colors } from '../../../theme/colors'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "user/find">;
const FindUser = () => {
  const navigation = useNavigation<NavigationProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });

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
              placeholder="Enter Email"
              lable={"Email"}
            />
            <Button onPress={() => { navigation.navigate("otp/verification") }}>
              Send OTP
            </Button>
          </View>
        </ScrollView>
        <View style={{ paddingVertical: 10, display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.goBack() }}>
            <Typography color={colors.primary.main} variant="SmallerTextSemiBold">
              {`<`} Back to login
            </Typography>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TostMessage
        message={toaster.message}
        visible={toaster.visible}
        variant={toaster.variant}
        onHide={setToaster}
      />
    </Fragment>
  )
}

export default FindUser
