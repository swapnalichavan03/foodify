import React, { Fragment, useEffect } from 'react'
import Header from '../../../components/header'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import moment from 'moment'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextField from '../../../components/textfield'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "people/conversation">
const Conversation = () => {
    const navigation = useNavigation<navigationProps>()
    const insets = useSafeAreaInsets();

    useEffect(() => {

    }, []);

    return (
        <Fragment>
            {/* <Header title='Conversations' /> */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <Typography variant="MediumTextBold">Conversations</Typography>
            </View>
            <View style={{ paddingHorizontal: 20, paddingBottom: 10, }}>
                <TextField
                    startIcon={() => (
                        <AntDesign name='search1' color={colors.neturalcolour.gray_4} size={20} />
                    )}
                    size="small"
                    placeholder='Search'
                    editable={false}
                    readOnly={true}
                // onPress={() => { navigation.navigate("people/search") }}
                />
            </View>
            <FlatList
                data={Array.from({ length: 20 })}
                renderItem={({ item }) => {
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => { navigation.navigate({ name: "people/conversation/room", params: { _people: "user" } }) }} activeOpacity={0.7} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 20 }}>
                                <View style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "row", gap: 15 }}>
                                    <Image source={{ uri: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" }} resizeMode="cover" style={{ height: 50, width: 50, borderRadius: (50 / 2) }} />
                                    <View style={{ flex: 1 }}>
                                        <Typography numberOfLines={1} styles={{ flex: 1 }} variant="SmallTextBold">Bella Throne</Typography>
                                        <Typography numberOfLines={1} styles={{ flex: 1 }} variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3}>{moment().format("MMMM DD, YYYY - HH:mm A")}</Typography>
                                    </View>
                                </View>
                                <Typography styles={{}} variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_1}>{moment().format("HH:mm A")}</Typography>
                            </TouchableOpacity>
                        </Fragment>
                    )
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 10, paddingTop: 10 }}
                ItemSeparatorComponent={() => (
                    <View style={{ marginVertical: 10, height: .5, backgroundColor: colors.neturalcolour.gray_3 }} />
                )}
            />
        </Fragment>
    )
}

export default Conversation
