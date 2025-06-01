import React, { Fragment, useState } from 'react'
import { Dimensions, Image, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Button from '../../../components/button'
import TextField from '../../../components/textfield'
import { useKeyBoardOpen } from '../../../hooks/useKeyBoardOpen'
import { useStyles } from './styles'
import { colors } from '../../../theme/colors'
import { hexToRgb } from '../../../utils/hexToRgb'
import Typography from '../../../components/typography'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../utils/linking'
import { RootState } from '../../../store'
import { imagesProps, setDeleteImage } from '../../../store/reducers/images'
import { instructionsProps } from '../create/create'
import { setInstructionsData } from '../../../store/reducers/createrecipe'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const AddSteps = () => {
    const navigation = useNavigation<navigationProps>();
    const { instructionimage } = useAppSelector((state: RootState) => state.createrecipe)
    const dispatch = useAppDispatch()
    const styles = useStyles()
    const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();
    const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
    const [inputValue, setInputValue] = useState<instructionsProps>({
        _id: 0,
        title: "",
        description: "",
        images: {
            _id: 0,
            url: "",
            type: "",
            size: 0
        },
    });

    const onChangeText = ({ name, value }: { name: string, value: string }) => {
        setInputValue({ ...inputValue, [name]: value })
    }

    const onSave = () => {
        if (!inputValue.title) return setToaster({ ...toaster, variant: "error", message: "Please enter step title.", visible: true })
        dispatch(setInstructionsData({
            data: {
                _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${new Date().getUTCMilliseconds()}`),
                title: inputValue.title,
                description: inputValue.description,
                images: { ...instructionimage },
            }
        }))
        navigation.goBack()
    }

    const onDeleteImage = (image?: string) => {
        dispatch(setDeleteImage({ image: image }))
    }

    return (
        <Fragment>
            <View style={{ height: 40, display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 20 }}>
                <TouchableOpacity activeOpacity={0.70} style={{ height: 30, width: 30, alignItems: "center", justifyContent: 'center' }} />
                <Typography variant="MediumTextSemiBold">Add Steps</Typography>
                <TouchableOpacity onPress={() => { navigation.goBack() }} activeOpacity={0.70} style={{ height: 30, width: 30, alignItems: "center", justifyContent: 'center' }}>
                    <AntDesign name='close' color={colors.common.black} size={20} />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                style={styles['keyboardavoidingaiew.style']}
                behavior="height"
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    style={styles['scrollview.style']}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles['scrollview.contentcontainerstyle']}
                >

                    <View style={{ gap: 5 }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <Typography variant="SmallTextRegular" styles={{ flex: 1 }} >
                                Step Photo
                            </Typography>
                            {instructionimage &&
                                <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "instructions" } }) }}>
                                    <Typography variant="SmallerTextRegular" color={colors.success.dark}>
                                        Change Photo
                                    </Typography>
                                </TouchableOpacity>
                            }
                        </View>
                        {instructionimage ?
                            <View style={{ overflow: "hidden", height: 180, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center" }}>
                                <Image source={{ uri: instructionimage.url }} resizeMode="cover" style={{ width: "100%", height: 180 }} />

                                <Pressable onPress={() => { onDeleteImage() }} style={{ position: "absolute", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 5, paddingHorizontal: 10, gap: 5, borderRadius: (35 / 2), right: 10, top: 10, backgroundColor: hexToRgb(colors.error.dark, .5) }}>
                                    <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                                    <Typography variant="SmallerTextBold" color={colors.error.dark}>Delete</Typography>
                                </Pressable>
                            </View>
                            :
                            <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "instructions" } }) }} activeOpacity={.50} style={{ gap: 5, backgroundColor: hexToRgb(colors.grey[400], .1), height: 180, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center" }}>
                                <FontAwesome name='photo' color={colors.grey[600]} size={30} />
                                <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>
                                    Upload photo here
                                </Typography>
                            </TouchableOpacity>
                        }
                    </View>

                    <TextField
                        lable={"Step name"}
                        placeholder='E.g. Indonesian Chicken Satai'
                        value={inputValue.title}
                        onChangeText={(event) => onChangeText({ name: "title", value: event })}
                    />

                    <TextField
                        lable={"Step Description"}
                        placeholder='E.g. Indonesian Chicken Satai'
                        multiline
                        height={140}
                        value={inputValue.description}
                        onChangeText={(event) => onChangeText({ name: "description", value: event })}
                    />
                </ScrollView>
                {!isKeyboardOpen &&
                    <View style={styles['buttton.container']}>
                        <Button onPress={() => { onSave() }} variant={"contain"} size={"medium"}>
                            Continue
                        </Button>
                    </View>
                }
            </KeyboardAvoidingView>

            <TostMessage
                message={toaster.message}
                visible={toaster.visible}
                variant={toaster.variant}
                // position={isKeyboardOpen ? "top" : "bottom"}
                onHide={setToaster}
            />
        </Fragment>
    )
}

export default AddSteps

