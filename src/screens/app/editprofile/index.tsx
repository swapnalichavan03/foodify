import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../../components/header';
import { FlatList, Image, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import TextField from '../../../components/textfield';
import Button from '../../../components/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../store';
import moment from 'moment';
import { updateprofiledetails } from '../../../service';
import { setProfile, setProfileImage } from '../../../store/reducers/userprofile';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import TostMessage, { ToasterProps } from '../../../components/toastmessage';
import { colors } from '../../../theme/colors';
import BottomSheet from '../../../components/bottomsheet';
import Calender from '../../../components/calender';
import Typography from '../../../components/typography';
import RNImage from '../../../components/rnimage';
import Avatar from '../../../components/avatar';

export type IProfileDetailsType = {
  customerName: string;
  gender: string;
  dateOfbirth: string;
  assets: {
    profileImage: string | null;
  };
  basic_info: {
    header: string | null,
    description: string | null,
    location: string | null,
  };
};

type navigationProps = NativeStackNavigationProp<RootStackParamList, "profile/details/update">
const EditProfile = () => {
  const navigation = useNavigation<navigationProps>()
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { profile } = useAppSelector((state: RootState) => state.userprofile);
  const [isDatePicker, setIsDatePicker] = useState<true | false>(false)
  const [isGenderPicker, setIsGenderPicker] = useState<true | false>(false)
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [isLoading, setIsLoading] = useState<true | false>(false)
  const [inputValue, setInputValue] = useState<IProfileDetailsType>({
    customerName: "",
    gender: "",
    dateOfbirth: "",
    assets: {
      profileImage: ""
    },
    basic_info: {
      header: "",
      description: "",
      location: ""
    },
  })

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      setInputValue((prevState) => ({
        ...prevState,
        basic_info: {
          ...prevState.basic_info,
          description: prevState.basic_info.description + '\n',
        },
      }));
    }
  };

  const onChangeText = ({ name, value }: { name: string; value: string }) => {
    setInputValue((prevState) => {
      const [parentKey, childKey] = name.split('.');

      if (childKey && parentKey in prevState) {
        const parent = prevState[parentKey as keyof typeof prevState];

        if (typeof parent === 'object' && parent !== null) {
          return {
            ...prevState,
            [parentKey]: {
              ...parent,
              [childKey]: value,
            },
          };
        }
      } else if (parentKey in prevState) {
        return {
          ...prevState,
          [parentKey]: value,
        };
      }

      return prevState;
    });
  };

  const onUpdateProfile = async () => {
    if (JSON.stringify(profile) === JSON.stringify(inputValue)) return setToaster({ ...toaster, variant: "info", message: "There are no changes for update.", visible: true })
    if (isLoading) return
    setIsLoading(true)
    await updateprofiledetails({
        customerName: inputValue.customerName,
        gender: inputValue.gender,
        dateOfbirth: inputValue.dateOfbirth,
        assets: {
            profileImage: profile?.image as string
        },
        basic_info: {
            header: inputValue.basic_info.header,
            description: inputValue.basic_info.description,
            location: inputValue.basic_info.location,
        }
    })
      .then((response) => {
        if (response.status === 200) {
          setToaster({ ...toaster, variant: "success", message: response.data.message, visible: true })
          dispatch(setProfile({ profile: response.data.profile }))
          dispatch(setProfileImage({ image: profile?.image }))
          setTimeout(() => {
            // navigation.goBack()
            navigation.navigate({ name: "user/profile", params: { _user: profile?._id as string } })
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("error.updateprofiledetails", error)
        setToaster({ ...toaster, variant: "error", message: error.response.data.message, visible: true })
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const onDiscardChanges = () => {
    if (profile) {
      setInputValue(profile);
      dispatch(setProfileImage({ image: profile.assets.profileImage }))
    }
  };

  useEffect(() => {
    onDiscardChanges()
  }, []);
  return (
    <Fragment>
      <Header
        isBack
        title='Update Profile'
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="height"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 20 }}
        >
          <View style={{ paddingBottom: 15, display: "flex", flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Avatar
              source={{ uri: profile?.image as string }}
              resizeMode="cover"
              alt={inputValue.customerName}
              // style={{ width: 100, height: 100, borderRadius: (100 / 2) }}
              width={100}
              height={100}
              borderRadius={100 / 2}
            />
            <View style={{ gap: 10 }}>
              <Typography variant="SmallTextRegular">Profile Image</Typography>
              <View style={{ width: 150 }}>
                <Button onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "profile" } }) }} variant="contain" size="tab">
                  Upload Image
                </Button>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              size="small"
              lable={"Name"}
              placeholder="Prem"
              value={inputValue.customerName}
              onChangeText={(text) => { onChangeText({ name: "customerName", value: text }) }}
              isError={!inputValue.customerName}
            />
          </View>

          <TextField
            size="small"
            editable={false}
            readOnly={true}
            lable={"Gender"}
            placeholder='Man'
            value={inputValue.gender}
            endIcon={() => {
              return (
                <Pressable onPress={() => { setIsGenderPicker(true) }}>
                  <Feather name='chevron-down' color={colors.grey[600]} size={22} />
                </Pressable>
              )
            }}
            onPress={() => { setIsGenderPicker(true) }}
          />
          <TextField
            size="small"
            editable={false}
            readOnly={true}
            lable={"Date of birth"}
            placeholder='7 March 2001'
            value={inputValue.dateOfbirth ? moment(inputValue.dateOfbirth).format("DD MMMM YYYY") : ""}
            endIcon={() => {
              return (
                <Pressable onPress={() => { setIsDatePicker(true) }}>
                  <AntDesign name='calendar' color={colors.grey[600]} size={20} />
                </Pressable>
              )
            }}
            onPress={() => { setIsDatePicker(true) }}
          />
          <TextField
            size="small"
            lable={"profile Header"}
            placeholder="Professional Chef"
            value={inputValue.basic_info.header as string}
            onChangeText={(text) => { onChangeText({ name: "basic_info.header", value: text }) }}
          />
          <TextField
            size="small"
            lable={"Description"}
            placeholder="Passionate about food and life 🥘🍲🍝🍱"
            multiline={true}
            height={100}
            value={inputValue.basic_info.description as string}
            onKeyPress={handleKeyPress}
            onChangeText={(text) => { onChangeText({ name: "basic_info.description", value: text }) }}
          />
          <TextField
            size="small"
            lable={"Location"}
            placeholder="📍 Chandrapur, Maharashtra, IN"
            multiline={true}
            height={70}
            value={inputValue.basic_info.location as string}
            onChangeText={(text) => { onChangeText({ name: "basic_info.location", value: text }) }}
          />
        </ScrollView>
        <View style={{ paddingBottom: insets.bottom || 10, paddingTop: 10, paddingHorizontal: 20, gap: 10, display: "flex", flexDirection: 'row', alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Button onPress={() => { onDiscardChanges() }} variant="text">
              Discard Changes
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={() => { onUpdateProfile() }} isLoading={isLoading}>
              Save Changes
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      <TostMessage
        message={toaster.message}
        visible={toaster.visible}
        variant={toaster.variant}
        // position={isKeyboardOpen ? "top" : "bottom"}
        onHide={setToaster}
      />


      <BottomSheet
        title={"Calender"}
        visible={isDatePicker}
        onCancel={() => { setIsDatePicker(false) }}
      >
        <View style={{ paddingBottom: insets.bottom || 20 }}>
          <ScrollView>
            <Calender
              onSelectDate={(date) => {
                onChangeText({ name: "dateOfbirth", value: date });
                setTimeout(() => {
                  setIsDatePicker(false)
                }, 300)
              }}
              disableFuture={true}
              selectedDate={inputValue.dateOfbirth ? inputValue.dateOfbirth : undefined}
            />
          </ScrollView>
        </View>
      </BottomSheet>

      <BottomSheet
        title={"Gender"}
        visible={isGenderPicker}
        onCancel={() => { setIsGenderPicker(false) }}
      >
        <View style={{ paddingBottom: insets.bottom || 20 }}>
          <FlatList
            data={["Man", "Woman", "Other"]}
            renderItem={(itme) => {
              return (
                <TouchableOpacity onPress={() => {
                  onChangeText({ name: "gender", value: itme.item });
                  setTimeout(() => {
                    setIsGenderPicker(false)
                  }, 300);
                }} style={{ paddingVertical: 10, paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ width: 20, alignItems: "center", justifyContent: "center" }}>
                    {inputValue.gender === itme.item && <Feather name='check' color={colors.primary.main} size={19} />}
                  </View>
                  <Typography variant={inputValue.gender === itme.item ? "SmallTextSemiBold" : "SmallTextRegular"} color={inputValue.gender === itme.item ? colors.primary.main : colors.grey[900]}>{itme.item}</Typography>
                </TouchableOpacity>
              )
            }}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.grey[300] }} />}
          />
        </View>
      </BottomSheet>
    </Fragment>
  );
}

export default EditProfile;



// function setNestedValue(obj: any, path: string, value: any) {
//   const keys = path.split('.');
//   let current = obj;

//   for (let i = 0; i < keys.length - 1; i++) {
//     const key = keys[i];
//     if (!current[key]) current[key] = {};
//     current = current[key];
//   }

//   current[keys[keys.length - 1]] = value;
// }

// const onChangeText = ({ name, value }: { name: string; value: string }) => {
//   setInputValue((prevState) => {
//     const newState = { ...prevState };
//     setNestedValue(newState, name, value);
//     return newState;
//   });
// };
