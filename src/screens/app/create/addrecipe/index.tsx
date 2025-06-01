import React, { Fragment, useState } from 'react'
import { addrecipeProps, actionProps, imagesProps } from '../create'
import { Alert, Dimensions, Image, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Button from '../../../../components/button'
import TextField from '../../../../components/textfield'
import { useKeyBoardOpen } from '../../../../hooks/useKeyBoardOpen'
import { useStyles } from '../styles'
import { colors } from '../../../../theme/colors'
import { hexToRgb } from '../../../../utils/hexToRgb'
import Typography from '../../../../components/typography'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../utils/linking'
import { setAddRecipeData, setDeleteRecipeImage } from '../../../../store/reducers/createrecipe'
import { RootState } from '../../../../store'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const AddRecipe = ({ action, setAction, activeAction, setActiveAction, toaster, setToaster }: actionProps) => {
    const navigation = useNavigation<navigationProps>();
    const dispatch = useAppDispatch()
    const { recipe } = useAppSelector((state: RootState) => state.createrecipe)
    const styles = useStyles()
    const [currentPage, setCurrentPage] = useState(0); // Track current page index
    const screenWidth = Dimensions.get("screen").width - 50; // Calculate screen width excluding padding
    const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();

    const onSave = () => {
        // if (!recipe.recipename) return setToaster({ ...toaster, variant: "error", message: "Please enter recipe title.", visible: true })
        // if (recipe.images.length === 0) return setToaster({ ...toaster, variant: "error", message: "Plase upload image of your recipe.", visible: true })
        setAction("recipetype");
        setActiveAction([...activeAction, "recipetype"])
    };

    const onChangeText = ({ name, value }: { name: string, value: string }) => {
        dispatch(setAddRecipeData({ name, value }))
    }

    const onDeleteImage = (image: string) => {
        dispatch(setDeleteRecipeImage({ image: image }))
    }

    const onScroll = (event: any) => {
        const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setCurrentPage(page); // Update the current page
    };

    const onUploadImage = async () => {

    };

    return (
        <Fragment>
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
                    <TextField
                        lable={"Recipe name"}
                        placeholder='Recipe name'
                        value={recipe.recipename}
                        onChangeText={(event) => onChangeText({ name: "recipename", value: event })}
                    />

                    <View style={{ gap: 5 }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <Typography variant="SmallTextRegular" styles={{ flex: 1 }} >
                                Add result photo
                            </Typography>
                            {recipe.images.length !== 0 && recipe.images.length !== 5 &&
                                <Pressable onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "recipe" } }) }}>
                                    <Typography variant="SmallTextSemiBold" color={colors.success.dark} >
                                        Add photo
                                    </Typography>
                                </Pressable>
                            }
                        </View>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                            style={{ borderRadius: 12 }}
                            contentContainerStyle={{ gap: 10 }}
                            showsHorizontalScrollIndicator={false}
                        >
                            {recipe.images.map((value: imagesProps, index: number) => {

                                return (
                                    <View key={index} style={{ height: 180, width: Dimensions.get("screen").width - 50 }}>
                                        <Image source={{ uri: value.url }} resizeMode="cover" style={{ borderRadius: 12, width: "100%", height: "100%" }} />

                                        <Pressable onPress={() => { onDeleteImage(value.url) }} style={{ position: "absolute", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 5, paddingHorizontal: 10, gap: 5, borderRadius: (35 / 2), right: 10, top: 10, backgroundColor: hexToRgb(colors.error.dark, .5) }}>
                                            <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                                            <Typography variant="SmallerTextBold" color={colors.error.dark}>Delete</Typography>
                                        </Pressable>
                                    </View>
                                )
                            })}
                            {recipe.images.length !== 5 &&
                                <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "recipe" } }) }} activeOpacity={.50} style={{ gap: 5, backgroundColor: hexToRgb(colors.grey[400], .1), height: 180, width: (Dimensions.get("screen").width - (recipe.images.length === 0 ? 40 : 60)), borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center" }}>
                                    <FontAwesome name='photo' color={colors.grey[600]} size={30} />
                                    <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>
                                        Upload photo here
                                    </Typography>
                                    <Typography variant="SmallerTextRegular" color={hexToRgb(colors.error.dark, .5)}>
                                        Minimum 1 and Maximum 5 images.
                                    </Typography>
                                </TouchableOpacity>
                            }
                        </ScrollView>

                        {/* Pagination Indicator */}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                            {recipe.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        height: 8,
                                        width: 8,
                                        borderRadius: 4,
                                        marginHorizontal: 4,
                                        backgroundColor: currentPage === index ? colors.primary.main : colors.grey[400],
                                    }}
                                />
                            ))}
                            {/* Indicator for the Upload Photo Button */}
                            {recipe.images.length !== 0 && recipe.images.length !== 5 &&
                                <View
                                    style={{
                                        height: 8,
                                        width: 8,
                                        borderRadius: 4,
                                        marginHorizontal: 4,
                                        backgroundColor: currentPage === recipe.images.length ? colors.primary.main : colors.grey[400],
                                    }}
                                />
                            }
                        </View>

                    </View>

                    <TextField
                        lable={"Recipe discription"}
                        placeholder='Recipe discription'
                        multiline
                        height={140}
                        value={recipe.recipediscription}
                        onChangeText={(event) => onChangeText({ name: "recipediscription", value: event })}
                    />

                </ScrollView>
                {!isKeyboardOpen &&
                    <View style={styles['buttton.container']}>
                        <Button onPress={() => { onSave() }} variant={"contain"} size={"medium"}>
                            Save & Continue
                        </Button>
                    </View>
                }
            </KeyboardAvoidingView>
        </Fragment>
    )
}

export default AddRecipe
