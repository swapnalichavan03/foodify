import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import AddRecipe from './addrecipe';
import Ingredients from './ingredients';
import Instructions from './instructions';
import RecipeSubmission from './recipesubmission';
import { actionType } from './create';
import TostMessage, { ToasterProps } from '../../../components/toastmessage';
import RecipeType from './recipetype';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import { getrecipe } from '../../../service';
import RNOverlay from '../../../components/rnoverlay';
import { useDispatch } from 'react-redux';
import { setAddRecipeData, setClearRecipe, setIngredientsData, setInstructionsData, setRecipeSubmissionData, setRecipeType } from '../../../store/reducers/createrecipe';
import moment from 'moment';

type navigationType = NativeStackNavigationProp<RootStackParamList, "recipe/create">
type routeType = RouteProp<RootStackParamList, "recipe/create">
const Create = () => {
  const dispatch = useDispatch();
  const { params } = useRoute<routeType>();
  const navigation = useNavigation<navigationType>();
  const [activeAction, setActiveAction] = useState<actionType[]>(["addrecipe"])
  const [action, setAction] = useState<actionType>("addrecipe")
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [isLoading, setIsLoading] = useState<true | false>(false)

  const onPrev = () => {
    if (action === "addrecipe") return
    setAction(
      action === "recipesubmission" ?
        "instructions"
        :
        action === "instructions" ?
          "ingredients"
          :
          action === "ingredients" ?
            "recipetype"
            :
            action === "recipetype" ?
              "addrecipe"
              :
              "addrecipe"
    )
    const prev = activeAction.filter((item: actionType) => item !== action);
    setActiveAction(prev);
  };

  useEffect(() => {
    if (params?._recipe && params?._creator) {
      (async () => {
        setIsLoading(true)
        await getrecipe(params?._recipe, params?._creator)
          .then((response) => {
            if (response.status === 200) {
              dispatch(setAddRecipeData({ name: "recipename", value: response.data.recipe.recipename }))
              dispatch(setAddRecipeData({ name: "recipediscription", value: response.data.recipe.recipediscription }))
              for (let image of response.data.recipe.images) {
                dispatch(setAddRecipeData({ name: "images", value: { _id: image._id, url: image.url, } }))
              }

              dispatch(setRecipeType({ name: "serves", value: response.data.recipe.serves }))
              for (let image of response.data.recipe.appliances) {
                dispatch(setRecipeType({ name: "image", value: { _id: image._id, title: "", image: { _id: image._id, url: image.image }, } }))
              }

              for (let ingredient of response.data.recipe.ingredients) {
                dispatch(setIngredientsData({
                  data: {
                    "name": ingredient.ingredient,
                    "measurementunit": ingredient.measurementunit,
                    "quantity": ingredient.quantity,
                    "images": Array.isArray(ingredient.images) ? ingredient.images[0] : null,
                    "_id": ingredient._id
                  }
                }))
              }
              for (let instruction of response.data.recipe.instructions) {
                dispatch(setInstructionsData({
                  data: {
                    "title": instruction.instruction,
                    "description": instruction.description,
                    "images": Array.isArray(instruction.images) ? instruction.images[0] : null,
                    "_id": instruction._id
                  }
                }))
              }

              dispatch(setRecipeSubmissionData({ name: "category", value: response.data.recipe.categorie._id }))
              dispatch(setRecipeSubmissionData({ name: "isScheduleed", value: response.data.recipe.isScheduleed }))
              dispatch(setRecipeSubmissionData({ name: "video", value: response.data.recipe.video }))
              for (const tag of response.data.recipe.tags) {
                dispatch(setRecipeSubmissionData({ name: "tags", value: tag }))
              }

              if (response.data.recipe.schedule && response.data.recipe.schedule.date) {
                dispatch(setRecipeSubmissionData({ name: "date", value: response.data.recipe.schedule.date ? response.data.recipe.schedule.date : new Date() }))
                dispatch(setRecipeSubmissionData({ name: "time", value: moment(`${response.data.recipe.schedule.date}${response.data.recipe.schedule.time}`).format("THH:00 A") }))
              }
            }
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => { setIsLoading(false) })
      })()
    } else {
      dispatch(setClearRecipe())
    }
  }, []);

  return (
    <Fragment>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 10, }}>
        {action !== "addrecipe" &&
          <Pressable onPress={() => { onPrev() }} style={{ position: "absolute", left: 20 }}>
            <AntDesign name='arrowleft' color={colors.neturalcolour.gray_2} size={25} />
          </Pressable>
        }
        <Typography variant="MediumTextSemiBold">Create Recipe</Typography>
        <Pressable onPress={() => navigation.goBack()} style={{ position: "absolute", right: 20 }}>
          <AntDesign name='close' color={colors.neturalcolour.gray_2} size={25} />
        </Pressable>
      </View>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 10 }}>
        {(["addrecipe", "recipetype", "ingredients", "instructions", "recipesubmission"] as actionType[]).map((value: actionType, index: number) => {
          return (
            <View key={index}
              style={{
                height: 4,
                // width: Dimensions.get("screen").width / 5,
                flex: 1 / 5,
                backgroundColor: activeAction.includes(value) ? colors.primary.main : colors.grey[400],
                ...(index === 0 && {
                  borderTopRightRadius: (4 / 2),
                  borderBottomRightRadius: (4 / 2),
                }),
                ...((index === 1 || index === 2 || index === 3) && {
                  borderRadius: (4 / 2),
                }),
                ...(index === 4 && {
                  borderTopLeftRadius: (4 / 2),
                  borderBottomLeftRadius: (4 / 2),
                }),
              }}
            />
          )
        })}
      </View>

      {action === "addrecipe" && (
        <AddRecipe
          action={action}
          setAction={setAction}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          toaster={toaster}
          setToaster={setToaster}
        />
      )}
      {action === "recipetype" && (
        <RecipeType
          action={action}
          setAction={setAction}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          toaster={toaster}
          setToaster={setToaster}
        />
      )}
      {action === "ingredients" && (
        <Ingredients
          action={action}
          setAction={setAction}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          toaster={toaster}
          setToaster={setToaster}
        />
      )}
      {action === "instructions" && (
        <Instructions
          action={action}
          setAction={setAction}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          toaster={toaster}
          setToaster={setToaster}
        />
      )}
      {action === "recipesubmission" && (
        <RecipeSubmission
          action={action}
          setAction={setAction}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          toaster={toaster}
          setToaster={setToaster}
        />
      )}

      <RNOverlay open={isLoading}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={"large"} color={colors.primary.main} />
        </View>
      </RNOverlay>
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

export default Create
