import React, { Fragment } from 'react'
import { actionProps, IAppliances } from '../create'
import { Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
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
import { setDeleteAppliances, setRecipeType } from '../../../../store/reducers/createrecipe'
import { RootState } from '../../../../store'
import RNImage from '../../../../components/rnimage'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const RecipeType = ({ action, setAction, activeAction, setActiveAction, toaster, setToaster }: actionProps) => {
  const navigation = useNavigation<navigationProps>();
  const dispatch = useAppDispatch()
  const { recipetype } = useAppSelector((state: RootState) => state.createrecipe)
  const styles = useStyles()
  const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();

  const onSave = () => {
    // if (!recipe.recipename) return setToaster({ ...toaster, variant: "error", message: "Please enter recipe title.", visible: true })
    // if (recipe.images.length === 0) return setToaster({ ...toaster, variant: "error", message: "Plase upload image of your recipe.", visible: true })
    setAction("ingredients");
    setActiveAction([...activeAction, "ingredients"])
  };

  const onChangeText = ({ name, value }: { name: string, value: string }) => {
    dispatch(setRecipeType({ name, value }))
  }

  const onDeleteAppliances = (item: IAppliances) => {
    dispatch(setDeleteAppliances({
      _id: item._id
    }))
  }

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
            lable={"Serves"}
            placeholder='3 Person'
            value={recipetype.serves === 0 ? "" : String(recipetype.serves)}
            onChangeText={(event) => onChangeText({ name: "serves", value: event })}
            endIcon={() => {
              return (
                <Typography variant="SmallTextRegular">Person</Typography>
              )
            }}
          />

          <View style={{ gap: 15 }}>
            <Typography variant="SmallTextRegular">
              Add required appliances <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_2}>(Optional)</Typography>
            </Typography>
            <View style={{ gap: 5, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              {recipetype.appliances.map((value: IAppliances, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      height: ((Dimensions.get("screen").width - 60) / 4),
                      width: ((Dimensions.get("screen").width - 60) / 4),
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: hexToRgb(colors.primary.main, .1),
                      backgroundColor: hexToRgb(colors.grey[300], .5),
                      overflow: "hidden"
                    }}
                  >
                    <RNImage
                      source={{ uri: value.image?.url }}
                      resizeMode="cover"
                      style={{
                        height: ((Dimensions.get("screen").width - 60) / 4),
                        width: ((Dimensions.get("screen").width - 60) / 4),
                      }}
                    />
                    <TouchableOpacity onPress={() => {onDeleteAppliances(value)}} activeOpacity={.60} style={{ width: 25, height: 25, backgroundColor: hexToRgb(colors.error.main, .3), alignItems: "center", justifyContent: "center", borderRadius: (25/2), position: "absolute", top: 5, right: 5}}>
                      <MaterialCommunityIcons name='delete-empty' size={18} color={colors.error.main} />
                    </TouchableOpacity>
                  </View>
                )
              })}
              <TouchableOpacity
                onPress={() => { navigation.navigate({ name: "camera/picker/image", params: { name: "appliances" } }) }}
                activeOpacity={0.60}
                style={{
                  height: ((Dimensions.get("screen").width - 60) / 4),
                  width: ((Dimensions.get("screen").width - 60) / 4),
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: hexToRgb(colors.primary.main, .1),
                  backgroundColor: hexToRgb(colors.grey[300], .5),
                  overflow: "hidden"
                }}>
                <AntDesign name='pluscircleo' size={30} color={colors.grey[800]} />
              </TouchableOpacity>
            </View>
          </View>


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

export default RecipeType;
