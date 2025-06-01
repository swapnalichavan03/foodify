import React, { Fragment, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import TextField from '../../../components/textfield';
import Button from '../../../components/button';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { facebookicon, iconsgoogle } from '../../../assets/icons/bold';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import TostMessage, { ToasterProps } from '../../../components/toastmessage';
import { usersignin } from '../../../service';
import { StorageManager } from '../../../helpers/localstorage/StorageManager';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsSignIn } from '../../../store/reducers/appauth';
import axios from 'axios';
// import { useNotification } from '../../../helpers/notification';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "auth/signin">;
const SignIn = () => {
  // const { uniqueId, token } = useNotification()
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [inputValue, setInputValue] = useState({
    username: "9511723507",
    password: "Prem_2@@1",
    isLoading: false,
    deviceToken: ""
  });

  const onSignIn = async () => {
    setInputValue({ ...inputValue, isLoading: true })
    await usersignin({
      username: inputValue.username,
      password: inputValue.password,
      notification: {
        // token: token as string,
        // device: uniqueId as string
      },
    })
      .then((response) => {
        if (response.status === 200) {
          StorageManager.setToken(response.data.token);
          dispatch(setIsSignIn({ isSignIn: true }))
        }
      })
      .catch((error) => {
        console.log("error.signin", error);
        if (error.response.data.message) {
          return setToaster({ ...toaster, visible: true, variant: "error", message: error.response.data.message, })
        } else {
          return setToaster({ ...toaster, visible: true, variant: "error", message: error.response.data.message, })
        }
      })
      .finally(() => {
        setInputValue({ ...inputValue, isLoading: false })
      })
  };

  const onTextInput = ({ value, name }: { value: string, name: string }) => {
    setInputValue({ ...inputValue, [name]: value })
  }

  return (
    <Fragment>
      <KeyboardAvoidingView style={{ flex: 1, }} behavior="height" keyboardVerticalOffset={0}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 100, paddingHorizontal: 15, justifyContent: "center" }}
        >
          <View style={{ gap: 20, }}>
            <View style={{ paddingBottom: 12 }}>
              <Typography variant="HeaderTextBold">
                Hello,
              </Typography>
              <Typography variant="LargeTextRegular">
                Welcome Back!
              </Typography>
            </View>

            <TextField
              value={inputValue.username}
              onChangeText={(text) => { onTextInput({ value: text, name: "username" }) }}
              placeholder="Enter Email"
              lable={"Email"}
            />
            <TextField
              value={inputValue.password}
              onChangeText={(text) => { onTextInput({ value: text, name: "password" }) }}
              placeholder="Enter Password"
              lable={"Enter Password"}
            />
            <TouchableOpacity onPress={() => { navigation.navigate("user/find") }} activeOpacity={0.6} style={{ alignSelf: "flex-end" }}>
              <Typography color={colors.primary.main} variant="SmallTextRegular">
                Forgot Password?
              </Typography>
            </TouchableOpacity>
            <Button isLoading={inputValue.isLoading} onPress={() => { onSignIn() }}>
              Sign In
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
          <Typography variant="SmallerTextSemiBold">Don't have an account?</Typography>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.navigate("auth/signup") }}>
            <Typography color={colors.primary.main} variant="SmallerTextSemiBold">
              Sign up
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

export default SignIn;
