import React, { Fragment, useState } from 'react'
import { ingredientsProps, type actionProps } from '../create'
import { Image, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Button from '../../../../components/button'
import { useKeyBoardOpen } from '../../../../hooks/useKeyBoardOpen'
import { useStyles } from '../styles'
import Typography from '../../../../components/typography'
import { colors } from '../../../../theme/colors'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useNavigation, } from '@react-navigation/native'
import { RootStackParamList } from '../../../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootState } from '../../../../store'
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setDeleteIngredient } from '../../../../store/reducers/createrecipe';

type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const Ingredients = ({ action, setAction, activeAction, setActiveAction, toaster, setToaster }: actionProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<navigationProps>();
  const { ingredients } = useAppSelector((state: RootState) => state.createrecipe)
  const styles = useStyles()
  const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen()
  const [inputValue, setInputValue] = useState<ingredientsProps[]>([])

  const onSave = () => {
    // if (!ingredients.length) return setToaster({ ...toaster, variant: "error", message: "Please add recipe ingredients.", visible: true })
    setAction("instructions");
    setActiveAction([...activeAction, "instructions"])
  };

  const onDelete = (_id: number) => {
    dispatch(setDeleteIngredient({ _id: _id }))
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
          <View>
            <Typography variant="MediumTextSemiBold">Add Ingredients to Your Recipe</Typography>
            <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>List Each Ingredients with Its Quantity and Measurement Unit</Typography>
          </View>

          <View>
            {ingredients.map((value: ingredientsProps, index: number) => {
              return (
                <View key={index} style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  paddingVertical: 10,
                  ...(index !== ingredients.length - 1 && {
                    borderBottomWidth: 1,
                    borderStyle: "solid",
                    borderBottomColor: colors.grey[300]
                  }),


                }}>
                  {value?.images.url &&
                    <Image source={{ uri: value.images.url }} resizeMode="stretch" style={{ width: 65, height: 65, borderRadius: 12 }} />
                  }
                  <View style={{ flex: 1 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="NormalTextSemiBold" styles={{ flex: 1 }}>{value.name}</Typography>
                      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <TouchableOpacity onPress={() => { onDelete(value._id) }} activeOpacity={.70}>
                          <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity activeOpacity={.70}>
                          <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                        </TouchableOpacity> */}
                      </View>
                    </View>
                    <Typography numberOfLines={2} variant="NormalTextRegular" color={colors.neturalcolour.gray_2} styles={{ flex: 1 }}>{value.quantity} {value.measurementunit}</Typography>
                  </View>
                </View>
              )
            })}
          </View>

          {ingredients.length === 0 &&
            <Button onPress={() => { navigation.navigate("recipe/ingredients") }} variant="outline" size="medium">
              Add Ingredients
            </Button>
          }

        </ScrollView>
        {!isKeyboardOpen &&
          <View style={styles['buttton.container']}>
            {ingredients.length !== 0 &&
              <Button onPress={() => { navigation.navigate("recipe/ingredients") }} variant="outline" size="medium">
                Add Ingredients
              </Button>
            }
            <Button onPress={() => { onSave() }} variant={"contain"} size={"medium"}>
              Save & Continue
            </Button>
          </View>
        }
      </KeyboardAvoidingView>
    </Fragment>
  )
}

export default Ingredients
