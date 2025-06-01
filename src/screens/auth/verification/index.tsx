import React, { Fragment, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import Button from '../../../components/button'
import Typography from '../../../components/typography'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking'
import TostMessage from '../../../components/toastmessage'
import OtpInput from '../../../components/otpinput'
import { colors } from '../../../theme/colors'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "otp/verification">;
const Verification = () => {
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
                OTP Verification,
              </Typography>
              <Typography variant="LargeTextRegular">
                Enter 6 digit otp
              </Typography>
            </View>

            <OtpInput
            
            />
            
            <Button onPress={() => { navigation.navigate("forgot/password") }}>
              Verify
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
    </Fragment>
  )
}

export default Verification
