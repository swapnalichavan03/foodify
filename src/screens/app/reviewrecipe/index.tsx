import React, { Fragment, useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Alert, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import Feather from "react-native-vector-icons/Feather"
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import Button from '../../../components/button'
import TextField from '../../../components/textfield'
import { RootStackParamList } from '../../../utils/linking'
import { addreview, updatereview } from '../../../service'
import { IReviewrecipe } from './reviewrecipe'
import Avatar from '../../../components/avatar'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import { RootState } from '../../../store'
import AllReviews from './allreviews'
import Header from '../../../components/header'
import { useAppSelector } from '../../../hooks/useAppSelector'
import ImagePreview from '../../../components/imagepreview'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setReviewImage, setUpdateImage } from '../../../store/reducers/recipereview'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "review/recipe">;
type RouteProps = RouteProp<RootStackParamList, "review/recipe">;
const ReviewRecipe = () => {
    const dispatch = useAppDispatch()
    const params = useRoute<RouteProps>();
    const navigation = useNavigation<navigationProps>();
    const { profile } = useAppSelector((state: RootState) => state.userprofile)
    const { images } = useAppSelector((state: RootState) => state.review)
    const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
    const [reviews, setReviews] = useState<IReviewrecipe[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState<true | false>(false);
    const [selectedReview, setSelectedReview] = useState<{ _recipe: string, _review: string, } | null>(null);
    const [openMenu, setOpenMenu] = useState<{ review: string, _recipe: string, _review: string, images: { url: string, _id: string }[] } | null>(null);
    const [isPreview, setIsPreview] = useState<true | false>(false)

    const addReview = async () => {
        if (!inputValue) return setToaster({ ...toaster, variant: "error", message: "Review cannot be empty.", visible: true })
        setIsLoading(true)
        if (selectedReview) {
            await updatereview(selectedReview._recipe, selectedReview._review, { review: inputValue, images: images.map((image, _) => ({ url: image.url })) })
                .then((response) => {
                    if (response.status === 200) {
                        setReviews((prev: IReviewrecipe[]) => {
                            const findIndex = prev.findIndex((item: IReviewrecipe) => item._id === response.data.data._id)
                            prev[findIndex] = response.data.data
                            return [...prev]
                        })
                        setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
                        setInputValue("");
                        setSelectedReview(null);
                        dispatch(setUpdateImage({
                            images: []
                        }))
                        dispatch(setReviewImage({
                            image: []
                        }))
                    }
                })
                .catch((error) => {
                    setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
                })
                .finally(() => setIsLoading(false))
        } else {
            await addreview(params.params._recipe, { review: inputValue, images: images.map((image, _) => ({ url: image.url })) })
                .then((response) => {
                    if (response.status === 201) {
                        setReviews((prev: IReviewrecipe[]) => {
                            const newReview = {
                                "_id": response.data.data._id as string,
                                "_creator": {
                                    "_id": profile?._id as string,
                                    "customerName": profile?.customerName as string,
                                    "assets": {
                                        profileImage: profile?.assets?.profileImage as string
                                    }
                                },
                                "_recipe": response.data.data._recipe as string,
                                "review": response.data.data.review as string,
                                "images": response?.data?.data?.images,
                                "createdAt": response.data.data.createdAt as string,
                                "likeCount": 0,
                                "dislikeCount": 0,
                                "likes": []
                            }
                            return [{ ...newReview }, ...prev]
                        })
                        setInputValue("")
                        setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
                        dispatch(setUpdateImage({
                            images: []
                        }))
                        dispatch(setReviewImage({
                            image: []
                        }))
                    }
                })
                .catch((error) => {
                    setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
                })
                .finally(() => setIsLoading(false))
        }
    };

    // const onChangeText = (newText: string) => {
    //     const bullet = '\u2022';
    //     const isLineBreak = newText.lastIndexOf('\n') === newText.length - 1;
    //     if (isLineBreak) {
    //         // setText(newText + bullet);
    //         setInputValue(newText + bullet)
    //     } else {
    //         setInputValue(newText)
    //         // setText(newText);
    //     }
    // };

    const handleKeyPress = (e: any) => {
        if (e.nativeEvent.key === 'Enter') {
            setInputValue((prev) => prev + '\n'); // Add new line when Enter is pressed
        }
    };

    return (
        <Fragment>
            <Header isBack title='Review' />
            <View style={{ paddingHorizontal: 20, gap: 15, paddingBottom: 10 }}>
                <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>{reviews.length} {reviews.length > 9 ? "Reviews" : "Review"}</Typography>

                <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                    <Pressable onPress={() => navigation.navigate({ name: "user/profile", params: { _user: profile?._id as string } })}>
                        <Avatar source={{ uri: profile?.assets.profileImage }} alt={profile?.customerName} resizeMode="cover" height={40} width={40} />
                    </Pressable>
                    <View style={{ gap: 10, flex: 1 }}>
                        <TextField
                            multiline={true}
                            height={100}
                            placeholder="Write review here"
                            value={inputValue}
                            onChangeText={(text) => { setInputValue(text) }}
                            // onChangeText={(text) => { onChangeText(text) }}
                            onKeyPress={handleKeyPress}
                            returnKeyType="default" // Optional: Configures the return key
                        />

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 5 }}
                        >
                            {images.map((image, index) => {
                                return (
                                    <Pressable key={index} onPress={() => { setIsPreview(true) }} style={{ backgroundColor: colors.grey[300], width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}>
                                        <Image source={{ uri: image?.url }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
                                    </Pressable>
                                )
                            })}
                        </ScrollView>
                        <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "review" } }) }} activeOpacity={.50} style={{ alignSelf: "flex-start", display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Feather name='camera' color={colors.primary.main} size={14} />
                            <Typography variant="SmallerTextRegular" color={colors.primary.main}>Add photo</Typography>
                        </TouchableOpacity>


                        <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
                            {selectedReview &&
                                <View style={{ flex: 1 }}>
                                    <Button onPress={() => { setInputValue(""); setSelectedReview(null) }} variant="outline" size="small">Cancel</Button>
                                </View>
                            }
                            <View style={{ flex: 1 }}>
                                <Button onPress={() => { addReview() }} isLoading={isLoading} variant="contain" size="small">{selectedReview ? "Update" : "Post"}</Button>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <AllReviews
                reviews={reviews}
                setReviews={setReviews}
                toaster={toaster}
                setToaster={setToaster}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                setInputValue={setInputValue}
                setSelectedReview={setSelectedReview}
            />

            <ImagePreview
                images={images.map((image, _) => ({
                    "url": image?.url,
                    "_id": String(image?._id),
                }))}
                onDelete={(image) => {
                    const filter = images.filter(({ _id }) => String(_id) !== image._id)
                    dispatch(setUpdateImage({
                        images: filter
                    }))
                }}
                visible={isPreview}
                onRequestClose={() => {
                    setIsPreview(false);
                }}
                isDelete={true}
            />

            <TostMessage
                message={toaster.message}
                visible={toaster.visible}
                variant={toaster.variant}
                onHide={setToaster}
            />
        </Fragment>
    )
}

export default ReviewRecipe
