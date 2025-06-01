import React, { Fragment, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import Header from '../../../components/header';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import Button from '../../../components/button';
import Avatar from '../../../components/avatar';
import TextField from '../../../components/textfield';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toastmessage, { ToasterProps } from '../../../components/toastmessage';
import { addreview, reciperating } from '../../../service';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import RNImage from '../../../components/rnimage';
import ImagePreview from '../../../components/imagepreview';
import { setReviewImage, setUpdateImage } from '../../../store/reducers/recipereview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

type navigationProp = NativeStackNavigationProp<RootStackParamList, "recipe/review/rating">
type routeProp = RouteProp<RootStackParamList, "recipe/review/rating">
const RecipeRating = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<navigationProp>();
  const { params } = useRoute<routeProp>();
  const insets = useSafeAreaInsets();
  const { profile } = useAppSelector((state: RootState) => state.userprofile)
  const { images } = useAppSelector((state: RootState) => state.review)
  const { recipe } = useAppSelector((state: RootState) => state.recipe)
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [isPreview, setIsPreview] = useState<true | false>(false)

  const addReview = async () => {
    if (!inputValue) return setToaster({ ...toaster, variant: "error", message: "Review cannot be empty.", visible: true })
    setIsLoading(true)
    await addreview(params._recipe,
      {
        review: inputValue,
        images: images.map((image, _) => ({
          url: image.url
        }))
      })
      .then((response) => {
        if (response.status === 201) {
          setInputValue("")
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
          dispatch(setUpdateImage({
            images: []
          }))
          dispatch(setReviewImage({
            image: []
          }))
          navigation.goBack();
        }
      })
      .catch((error) => {
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => setIsLoading(false))
  }

  const onRateRecipe = async (rating: number) => {
    setRatingCount(rating)
    await reciperating(params?._recipe, params?._user, { _rating: rating })
      .then((response) => {
        if (response.status === 200) {
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.reciperating", error)
      })
      .finally(() => { })
  }

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      setInputValue((prev) => prev + '\n'); // Add new line when Enter is pressed
    }
  };

  useEffect(() => {
    const count = recipe?.ratings.find((item) => item._user === profile?._id)?._ratings || 0
    setRatingCount(count as number)
  }, []);

  return (
    <Fragment>
      <Header
        isBack
        title='Write Review'
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 30 }}
      >
        <View style={{ gap: 10, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 70, height: 70, borderRadius: 12, overflow: "hidden" }}>
            <RNImage source={{ uri: recipe?.images[0].url }} resizeMode="cover" />
          </View>
          <View style={{ flex: 1 }}>
            <Typography numberOfLines={2} variant="MediumTextSemiBold" >
              {recipe?.recipename}
            </Typography>
            <Typography variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_2}>
              by {recipe?._creator.customerName}
            </Typography>
          </View>
        </View>


        <Typography variant="LargeTextSemiBold" color={colors.grey[900]} styles={{ textAlign: "center" }}>
          How Would You {`\n`}
          Rate This Recipe?
        </Typography>
        <View style={{ gap: 10 }}>
          <Typography variant="SmallerTextSemiBold" color={colors.grey[500]} styles={{ textAlign: "center" }}>Your overall rating</Typography>
          <View style={{ alignSelf: "center", display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity onPress={() => { onRateRecipe(1) }} activeOpacity={.60}>
              <AntDesign name={ratingCount >= 1 ? "star" : 'staro'} size={35} color={colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onRateRecipe(2) }} activeOpacity={.60}>
              <AntDesign name={ratingCount >= 2 ? "star" : 'staro'} size={35} color={colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onRateRecipe(3) }} activeOpacity={.60}>
              <AntDesign name={ratingCount >= 3 ? "star" : 'staro'} size={35} color={colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onRateRecipe(4) }} activeOpacity={.60}>
              <AntDesign name={ratingCount >= 4 ? "star" : 'staro'} size={35} color={colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onRateRecipe(5) }} activeOpacity={.60}>
              <AntDesign name={ratingCount >= 5 ? "star" : 'staro'} size={35} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => { }} >
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
                  <Pressable key={index} onPress={() => setIsPreview(true)} style={{ backgroundColor: colors.grey[300], width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}>
                    <Image source={{ uri: image.url }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
                  </Pressable>
                )
              })}
            </ScrollView>
            <TouchableOpacity onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "review" } }) }} activeOpacity={.50} style={{ alignSelf: "flex-start", display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Feather name='camera' color={colors.primary.main} size={14} />
              <Typography variant="SmallerTextRegular" color={colors.primary.main}>Add photo</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 10, paddingTop: 10 }}>
        <Button onPress={() => { addReview() }} isLoading={isLoading} variant="contain" size="medium">Post</Button>
      </View>

      <ImagePreview
        images={images.map((image, _) => ({
          "url": image.url,
          "_id": String(image._id),
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

      <Toastmessage
        message={toaster.message}
        visible={toaster.visible}
        variant={toaster.variant}
        onHide={setToaster}
      />
    </Fragment>
  );
}

export default RecipeRating;
