import React, { Fragment, useEffect, useState } from 'react'
import { type ICategories, type ITime, type actionProps } from '../create'
import { KeyboardAvoidingView, ScrollView, Image, TouchableOpacity, View, NativeSyntheticEvent, TextInputSubmitEditingEventData, FlatList, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Button from '../../../../components/button'
import TextField from '../../../../components/textfield'
import { useKeyBoardOpen } from '../../../../hooks/useKeyBoardOpen'
import { useStyles } from '../styles'
import Typography from '../../../../components/typography'
import { colors } from '../../../../theme/colors'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import BottomSheet from '../../../../components/bottomsheet'
import Calender from '../../../../components/calender'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { hexToRgb } from '../../../../utils/hexToRgb'
import { createrecipe, getcategories } from '../../../../service'
import { removeDuplicateObject } from '../../../../utils/removeduplicate'
import { setRecipeSubmissionData, setRemoveRecipeTags } from '../../../../store/reducers/createrecipe'
import moment from 'moment'
import Video from 'react-native-video'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const scheduletime: ITime[] = [
  {
    title: "Morning",
    time: "06 AM",
    value: "T06:00"
  },
  {
    title: "Afternoon",
    time: "12 PM",
    value: "T12:00"
  },
  {
    title: "Evening",
    time: "05 PM",
    value: "T17:00"
  },
]

type navigationType = NativeStackNavigationProp<RootStackParamList, "recipe/create">
type routeType = RouteProp<RootStackParamList, "recipe/create">
const RecipeSubmission = ({ action, setAction, activeAction, setActiveAction, toaster, setToaster }: actionProps) => {
  const { params } = useRoute<routeType>();
    const navigation = useNavigation<navigationType>();
  const styles = useStyles()
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch()
  const { recipe, recipetype, ingredients, instructions, submission } = useAppSelector((state) => state.createrecipe)
  const [isDatePicker, setIsDatePicker] = useState<true | false>(false)
  const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();
  const [isVisible, setIsVisible] = useState<true | false>(false);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [tags, setTags] = useState<string>("");
  const [isLoading, setIsLoading] = useState<false | true>(true);
  const [isSubmit, setIsSubmit] = useState<false | true>(false);
  const [isSubmitDraft, setIsSubmitDraft] = useState<false | true>(false);
  const [isSubmitSchedule, setIsSubmitSchedule] = useState<false | true>(false);

  const onTextChange = ({ name, value }: { name: string, value: string }) => {
    dispatch(setRecipeSubmissionData({
      name: name,
      value: value
    }))
  }

  useEffect(() => {
    (async () => {
      await getcategories()
        .then((response) => {
          if (response.status === 200) {
            if (Array.isArray(response.data.data)) {
              setCategories(response.data.data)
            }
          }
        })
        .catch((error) => {
          console.log("error.getcategories")
        })
        .finally(() => {
          setIsLoading(false)
        })
    })();
  }, []);

  useEffect(() => {
    onTextChange({
      name: "time",
      value: submission.schedule.date.split("T")[0] === moment().format().split("T")[0] ?
        moment().format("Thh:mm") >= "T06:00" ?
          "T12:00"
          :
          moment().format("Thh:mm") >= "T12:00" ?
            "T17:00"
            :
            "T06:00"
        :
        "T06:00"
    })
  }, [submission.schedule.date]);

  const onPublish = async () => {
    setIsSubmit(true)
    await createrecipe({
      "recipename": recipe.recipename,
      "recipediscription": recipe.recipediscription,
      "images": recipe?.images.map((image, _) => ({
        "url": image.url
      })),
      "serves": recipetype.serves,
      "appliances": recipetype.appliances.map((image, _) => ({
        "image": String(image.image)
      })),
      "video": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "ingredients": ingredients.map((value, _) => ({
        "ingredient": value?.name,
        "measurementunit": value?.measurementunit,
        "quantity": value?.quantity,
        "images": [{ "url": String(value?.images) }],
      })),
      "instructions": instructions.map((value, _) => ({
        "instruction": value.title,
        "description": value.description,
        "images": [{ "url": String(value.images) }]
      })),
      "status": "PUBLISHED",
      "isScheduleed": false,
      "schedule": {
        "date": submission.schedule.date.split("T")[0],
        "time": `T${moment(`${submission.schedule.date.split("T")[0]}${submission.schedule.time}`).format().split("T")[1]}`,
      },
      "preparingTime": {
        "HH": 0,
        "MM": 40
      },
      "tags": submission.tags,
      "categorie": submission.category
    })
      .then((response) => {
        if (response.status === 201) {
          return setToaster({ ...toaster, variant: "success", message: response.data.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.createrecipe", error)
      })
      .finally(() => { setIsSubmit(false) })
  }
  const onSchedulePublish = async () => {
    setIsSubmitSchedule(true)
    await createrecipe({
      "recipename": recipe.recipename,
      "recipediscription": recipe.recipediscription,
      "images": recipe?.images.map((image, _) => ({
        "url": image.url
      })),
      "serves": recipetype.serves,
      "appliances": recipetype.appliances.map((image, _) => ({
        "image": String(image.image)
      })),
      "video": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "ingredients": ingredients.map((value, _) => ({
        "ingredient": value?.name,
        "measurementunit": value?.measurementunit,
        "quantity": value?.quantity,
        "images": [{ "url": String(value?.images) }],
      })),
      "instructions": instructions.map((value, _) => ({
        "instruction": value.title,
        "description": value.description,
        "images": [{ "url": String(value.images) }]
      })),
      "status": "PUBLISHED",
      "isScheduleed": true,
      "schedule": {
        "date": submission.schedule.date.split("T")[0],
        "time": `T${moment(`${submission.schedule.date.split("T")[0]}${submission.schedule.time}`).format().split("T")[1]}`,
      },
      "preparingTime": {
        "HH": 0,
        "MM": 40
      },
      "tags": submission.tags,
      "categorie": submission.category
    })
      .then((response) => {
        if (response.status === 201) {
          return setToaster({ ...toaster, variant: "success", message: response.data.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.createrecipe", error)
      })
      .finally(() => { setIsSubmitSchedule(false) })
  }
  const onSaveAsDraft = async () => {
    setIsSubmitDraft(true)
    await createrecipe(
      {
        "recipename": recipe.recipename,
        "recipediscription": recipe.recipediscription,
        "images": recipe?.images.map((image, _) => ({
          "url": image.url
        })),
        "serves": recipetype.serves,
        "appliances": recipetype.appliances.map((image, _) => ({
          "image": image.image?.url as string
        })),
        "video": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        "ingredients": ingredients.map((value, _) => ({
          "ingredient": value?.name,
          "measurementunit": value?.measurementunit,
          "quantity": value?.quantity,
          "images": [{ "url": value?.images.url }],
        })),
        "instructions": instructions.map((value, _) => ({
          "instruction": value.title,
          "description": value.description,
          "images": [{ "url": value.images.url }]
        })),
        "status": "DRAFT",
        "isScheduleed": false,
        "schedule": {
          "date": submission.schedule.date.split("T")[0],
          "time": `T${moment(`${submission.schedule.date.split("T")[0]}${submission.schedule.time}`).format().split("T")[1]}`,
        },
        "preparingTime": {
          "HH": 0,
          "MM": 40
        },
        "tags": submission.tags,
        "categorie": submission.category
      }
    )
      .then((response) => {
        if (response.status === 201) {
          return setToaster({ ...toaster, variant: "success", message: response.data.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.createrecipe", error?.response?.data)
      })
      .finally(() => { setIsSubmitDraft(false) })
  }

  const removeDuplicate = removeDuplicateObject<ICategories>(categories)
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
          <View>
            <Typography variant="MediumTextSemiBold">
              Add Final Touches to Your Recipe
            </Typography>
            <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>
              Select Recipe Categories and Add Relevant Tags for Better Discoverability
            </Typography>
          </View>

          <TextField
            lable={"Select Category"}
            placeholder='Select Category'
            readOnly={true}
            editable={false}
            endIcon={() => (
              <Feather name='chevron-down' size={22} color={colors.grey[700]} />
            )}
            onPress={() => { setIsVisible(true) }}
            value={categories.find((item: ICategories) => item._id === submission.category)?.type}
          />
          <TextField
            lable={"Tag(S)"}
            placeholder='chicken briyani'
            returnKeyType="next"
            keyboardType="default"
            onChangeText={(text) => {
              setTags(text)
            }}
            value={tags}
            onSubmitEditing={(text: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
              const { text: value } = text?.nativeEvent
              onTextChange({
                name: "tags",
                value: tags
              })
              setTags("")
            }}
          />

          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 5 }}>
            {submission.tags.map((value: string, index: number) => {

              return (
                <Pressable key={index} style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: colors.primary.main,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center"
                }}>
                  <Typography variant="SmallTextSemiBold">{value}</Typography>
                  <TouchableOpacity onPress={() => { dispatch(setRemoveRecipeTags({ tag: value })) }} activeOpacity={0.70} >
                    <MaterialCommunityIcons name='delete-empty' color={colors.error.main} size={16} />
                  </TouchableOpacity>
                </Pressable>
              )
            })}
          </View>

          <View style={{ gap: 5 }}>
            <Typography variant="SmallTextRegular">
              You can upload full recipe video <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_2}>(Optional)</Typography>
            </Typography>
            <TouchableOpacity onPress={() => { }} activeOpacity={submission.video ? 1 : .50} style={{ gap: 5, backgroundColor: hexToRgb(colors.grey[400], .1), height: 180, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.neturalcolour.gray_3, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {submission.video ?
                <Fragment>
                  <Video muted paused repeat controls source={{uri: submission.video}} resizeMode="cover" style={{ height: 180, width: "100%" }} />
                </Fragment>
                :
                <Fragment>
                  <Ionicons name='videocam' color={colors.grey[600]} size={30} />
                  <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>
                    Upload video here
                  </Typography>
                </Fragment>
              }
            </TouchableOpacity>

          </View>

        </ScrollView>
        {!isKeyboardOpen &&
          <View style={styles['buttton.container']}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button onPress={() => { onSaveAsDraft() }} isLoading={isSubmitDraft} variant={"outline"} size={"medium"}>
                  Save as draft
                </Button>
              </View>
              <View style={{ flex: 1 / 2 }}>
                <Button onPress={() => { onPublish() }} isLoading={isSubmit} variant={"contain"} size={"medium"}>
                  Publish
                </Button>
              </View>
            </View>
            <Button onPress={() => { setIsDatePicker(true) }} variant={"outline"} size={"medium"}>
              Schedule Post
            </Button>
          </View>
        }
      </KeyboardAvoidingView>

      <BottomSheet
        title='Calender'
        visible={isDatePicker}
        onCancel={() => { setIsDatePicker(false) }}
      >
        <View style={{ paddingBottom: insets.bottom || 20 }}>
          <ScrollView>
            <Calender
              selectedDate={submission.schedule.date}
              onSelectDate={(date) => {
                onTextChange({ name: "date", value: date })
              }}
              disablePast={true}
            />
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
          >
            {scheduletime.map((value: ITime, index: number) => {

              return (
                <TouchableOpacity
                  onPress={() => {
                    if (new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value) return
                    onTextChange({
                      name: "time",
                      value: value.value
                    })
                  }}
                  disabled={new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value}
                  key={index}
                  activeOpacity={0.80}
                  style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor:
                      new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value ?
                        hexToRgb(colors.grey[500], .3)
                        :
                        hexToRgb(colors.primary.main, .3),
                    backgroundColor:
                      submission.schedule.time === value.value ?
                        hexToRgb(colors.primary.main, 1)
                        :
                        colors.common.transparent,
                    borderRadius: 8,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    gap: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start"
                  }}>
                  <AntDesign
                    name='clockcircleo'
                    size={14}
                    color={
                      submission.schedule.time === value.value ?
                        colors.common.white
                        :
                        new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value ?
                          colors.grey[400]
                          :
                          colors.grey[800]
                    }
                  />
                  <View>
                    <Typography
                      variant="SmallerTextSemiBold"
                      color={
                        submission.schedule.time === value.value ?
                          colors.common.white
                          :
                          new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value ?
                            colors.grey[400]
                            :
                            colors.grey[800]
                      }>
                      {value.title} Time
                    </Typography>
                    <Typography
                      variant="SmallerTextSemiBold"
                      color={
                        submission.schedule.time === value.value ?
                          colors.common.white
                          :
                          new Date().getDate() === new Date(submission.schedule.date).getDate() && moment().format("Thh:mm") >= value.value ?
                            colors.grey[400]
                            :
                            colors.grey[800]
                      }>
                      {value.time}
                    </Typography>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
          <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
            <Button
              onPress={() => {
                onSchedulePublish()
              }}
              isLoading={isSubmitSchedule}
            >
              Schedule and  Publish
            </Button>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        title='Category'
        visible={isVisible}
        onCancel={() => { setIsVisible(false) }}
      >
        <FlatList
          data={Array.isArray(removeDuplicate) ? removeDuplicate : []}
          renderItem={({ item }: { item: ICategories }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onTextChange({ name: "category", value: item._id })
                  setIsVisible(false)
                }}
                activeOpacity={0.60}
                style={{ gap: 2, paddingVertical: 10 }}
              >
                <Typography color={submission.category === item._id ? colors.primary.main : colors.grey[800]} variant="SmallTextSemiBold">{item.type}</Typography>
                <Typography color={submission.category === item._id ? hexToRgb(colors.primary.main, .8) : colors.grey[500]} numberOfLines={3} variant="SmallTextRegular">{item.description}</Typography>
              </TouchableOpacity>
            )
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.grey[300] }} />
          )}
          ListEmptyComponent={() => {
            return (
              <View style={{ paddingVertical: 10 }}>
                {Array.isArray(removeDuplicate) && removeDuplicate.length === 0 && isLoading ?
                  <ActivityIndicator size={"large"} color={colors.primary.main} />
                  :
                  <Typography variant="SmallTextSemiBold" color={colors.grey[500]} styles={{ textAlign: "center" }}>There are no categories found</Typography>
                }
              </View>
            )
          }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 10 }}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>
    </Fragment >
  )
}
export default RecipeSubmission
