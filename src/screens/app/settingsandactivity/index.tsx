import React, { Fragment } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from "react-native-vector-icons/Entypo"; // notification // notifications-off
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/header';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import { hexToRgb } from '../../../utils/hexToRgb';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "app/settings">
const SettingsAndActivity = () => {
  const navigation = useNavigation<NavigationProps>();
  const insets = useSafeAreaInsets();
  return (
    <Fragment>
      <Header
        isBack
        title="Settings"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.grey[300] }}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
      >

        <TouchableOpacity onPress={() => { navigation.navigate("app/setting/notification") }} activeOpacity={.60} style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, borderRadius: 12, padding: 13, borderWidth: 1, borderStyle: "solid", borderColor: colors.grey[400], backgroundColor: colors.grey[100] }}>
          <View style={{ alignItems: "flex-start", display: "flex", flexDirection: "row", gap: 10 }}>
            <Entypo name='notification' size={22} color={colors.grey[700]} />
            <View>
              <Typography variant="MediumTextRegular">Notification</Typography>
              <Typography variant="SmallerTextRegular" color={colors.grey[500]} >Manage Your Notification</Typography>
            </View>
          </View>
          <AntDesign name='arrowright' size={20} color={colors.grey[700]} />
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity onPress={() => { navigation.navigate("app/user/logout") }} activeOpacity={.60} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: insets.bottom || 20, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, borderRadius: 12, padding: 13, borderWidth: 1, borderStyle: "solid", borderColor: hexToRgb(colors.error.main, .2), backgroundColor: colors.grey[100] }}>
        <View style={{ alignItems: "flex-start", display: "flex", flexDirection: "row", gap: 10 }}>
          <MaterialIcons name='logout' size={22} color={colors.error.main} />
          <Typography variant="MediumTextRegular" color={colors.error.main}>Logout</Typography>
        </View>
        <AntDesign name='arrowright' size={20} color={hexToRgb(colors.error.main, .7)} />
      </TouchableOpacity>
    </Fragment>
  );
}

export default SettingsAndActivity;
