import React, { Fragment, useState } from 'react'
import { Image, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
import { setDeleteIngredientImage, setIngredientsData } from '../../../store/reducers/createrecipe'
import { ingredientsProps } from '../create/create'
import BottomSheet from '../../../components/bottomsheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'

interface unitsProps {
    name: string,
    value: string,
}
type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const AddIngredients = () => {
    const navigation = useNavigation<navigationProps>();
    const insets = useSafeAreaInsets();
    const { ingredientimage } = useAppSelector((state: RootState) => state.createrecipe)
    const dispatch = useAppDispatch()
    const styles = useStyles()
    const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();
    const [isVisible, setIsVisible] = useState<true | false>(false);
    const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
    const [inputValue, setInputValue] = useState<ingredientsProps>({
        _id: 0,
        name: "",
        measurementunit: "gm",
        quantity: "",
        images: {
            _id: 0,
            url: "",
            type: "",
            size: 0
        }
    });

    const onChangeText = ({ name, value }: { name: string, value: string }) => {
        setInputValue({ ...inputValue, [name]: value })
    }

    const onSave = () => {
        if (!inputValue.name) return setToaster({ ...toaster, variant: "error", message: "Please enter ingredients name.", visible: true })
        if (!inputValue.quantity) return setToaster({ ...toaster, variant: "error", message: "Please enter ingredients name.", visible: true })

        dispatch(setIngredientsData({
            data: {
                _id: Number(`${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${new Date().getUTCMilliseconds()}`),
                name: inputValue.name,
                measurementunit: inputValue.measurementunit,
                quantity: inputValue.quantity,
                images: { ...ingredientimage }
            }
        }))
        navigation.goBack()
    }

    const onDeleteImage = (image?: string) => {
        dispatch(setDeleteIngredientImage({ image: image }))
    }

    return (
        <Fragment>
            <View style={{ height: 40, display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 20 }}>
                <TouchableOpacity activeOpacity={0.70} style={{ height: 30, width: 30, alignItems: "center", justifyContent: 'center' }} />
                <Typography variant="MediumTextSemiBold">Add Ingredients</Typography>
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
                                Ingredients Photo
                            </Typography>
                            {ingredientimage &&
                                <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "ingredients" } }) }}>
                                    <Typography variant="SmallerTextRegular" color={colors.success.dark}>
                                        Change Photo
                                    </Typography>
                                </TouchableOpacity>
                            }
                        </View>
                        {ingredientimage ?
                            <View style={{ overflow: "hidden", height: 180, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center" }}>
                                <Image source={{ uri: ingredientimage.url }} resizeMode="cover" style={{ width: "100%", height: 180 }} />

                                <Pressable onPress={() => { onDeleteImage() }} style={{ position: "absolute", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 5, paddingHorizontal: 10, gap: 5, borderRadius: (35 / 2), right: 10, top: 10, backgroundColor: hexToRgb(colors.error.dark, .5) }}>
                                    <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                                    <Typography variant="SmallerTextBold" color={colors.error.dark}>Delete</Typography>
                                </Pressable>
                            </View>
                            :
                            <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "ingredients" } }) }} activeOpacity={.50} style={{ gap: 5, backgroundColor: hexToRgb(colors.grey[400], .1), height: 180, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center" }}>
                                <FontAwesome name='photo' color={colors.grey[600]} size={30} />
                                <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>
                                    Upload photo here
                                </Typography>
                            </TouchableOpacity>
                        }
                    </View>

                    <TextField
                        lable={"Ingredient name"}
                        placeholder='E.g. Peanut'
                        value={inputValue.name}
                        onChangeText={(event) => onChangeText({ name: "name", value: event })}
                    />

                    <View style={{ height: 1, backgroundColor: colors.grey[300] }} />
                    <View style={{ gap: 5 }}>
                        <View style={{}}>
                            <Typography variant="SmallTextRegular" styles={{ flex: 1 }} >
                                Measurement Units
                            </Typography>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10, justifyContent: "space-between" }}>
                            <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2} styles={{ flex: 1 }}>
                                Choose The Appropriate Unit (e.g, Gram,{`\n`}Kilogram)
                            </Typography>
                            <TouchableOpacity onPress={() => { setIsVisible(true) }}>
                                <Typography variant="MediumTextRegular" color={colors.success.dark} styles={{ textDecorationLine: "underline", textDecorationStyle: "dotted", textDecorationColor: colors.grey[400] }}>
                                    {units.find((item: unitsProps) => item.value === inputValue.measurementunit)?.name}
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: colors.grey[300] }} />
                    <TextField
                        lable={"Quantity"}
                        placeholder='E.g. 200'
                        value={inputValue.quantity}
                        onChangeText={(event) => onChangeText({ name: "quantity", value: event })}
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

            <BottomSheet
                title='Measurement'
                visible={isVisible}
                onCancel={() => { setIsVisible(false) }}
            >
                <ScrollView
                    style={{}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: insets.bottom }}
                >
                    <View>
                        {units.map((value, index) => {
                            return (
                                <View key={index}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setInputValue({
                                                ...inputValue,
                                                measurementunit: value.value
                                            });
                                            setIsVisible(false)
                                        }}

                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 15,
                                            ...(index !== units.length - 1 && {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.grey[300],
                                                borderStyle: "solid"
                                            })
                                        }}
                                    >
                                        <Typography variant="MediumTextRegular" styles={{ lineHeight: 0 }}>{value.name}</Typography>
                                        <Typography variant="NormalTextRegular" color={colors.grey[400]} styles={{ lineHeight: 0 }}>{value.value}</Typography>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </BottomSheet>

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

export default AddIngredients;


const units: unitsProps[] = [
    {
        name: "Gram",
        value: "gm"
    },
    {
        name: "Litter",
        value: "l"
    },
    {
        name: "Milliliter",
        value: "ml"
    }
]
