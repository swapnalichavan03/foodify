import React, { Fragment, useState } from 'react'
import { instructionsProps, type actionProps } from '../create'
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Button from '../../../../components/button'
import { useKeyBoardOpen } from '../../../../hooks/useKeyBoardOpen'
import { useStyles } from '../styles'
import Typography from '../../../../components/typography'
import { colors } from '../../../../theme/colors'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../utils/linking'
import { useNavigation } from '@react-navigation/native'
import { RootState } from '../../../../store'
import { setDeleteStep } from '../../../../store/reducers/createrecipe'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/create">
const Instructions = ({ action, setAction, activeAction, setActiveAction, toaster, setToaster }: actionProps) => {
    const navigation = useNavigation<navigationProps>();
    const dispatch = useAppDispatch()
    const { instructions } = useAppSelector((state: RootState) => state.createrecipe)
    const styles = useStyles()
    const { isKeyboardOpen, onKeyboardDismiss } = useKeyBoardOpen();

    const onSave = () => {
        // if (!instructions.length) return setToaster({ ...toaster, variant: "error", message: "Please add cooking steps.", visible: true })
        setAction("recipesubmission");
        setActiveAction([...activeAction, "recipesubmission"])
    };

    const onDelete = (_id: number) => {
        dispatch(setDeleteStep({ _id: _id }))
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
                        <Typography variant="MediumTextSemiBold">Add Step-by-step Instructions</Typography>
                        <Typography variant="SmallTextRegular" color={colors.neturalcolour.gray_2}>List Each Ingredients with Its Quantity and Measurement Unit</Typography>
                    </View>

                    <View>
                        {instructions.map((value: instructionsProps, index: number) => {

                            return (
                                <View key={index} style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    paddingVertical: 10,
                                    ...(index !== instructions.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderStyle: "solid",
                                        borderBottomColor: colors.grey[300]
                                    }),


                                }}>
                                    {value.images.url &&
                                        <Image source={{ uri: value.images.url }} resizeMode="stretch" style={{ width: 65, height: 65, borderRadius: 12 }} />
                                    }
                                    <View style={{ flex: 1 }}>
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Typography variant="NormalTextSemiBold" styles={{ flex: 1 }}>{value.title}</Typography>
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                <TouchableOpacity onPress={() => { onDelete(value._id) }} activeOpacity={.70}>
                                                    <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity activeOpacity={.70}>
                                                    <MaterialCommunityIcons name='delete-empty' color={colors.error.dark} size={20} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                        <Typography numberOfLines={2} variant="NormalTextRegular" color={colors.neturalcolour.gray_2} styles={{ flex: 1 }}>{value.description}</Typography>
                                    </View>
                                </View>
                            )
                        })}
                    </View>

                    {instructions.length === 0 &&
                        <Button onPress={() => { navigation.navigate("recipe/steps") }} variant="outline" size="medium">
                            Add Step
                        </Button>
                    }

                </ScrollView>

                {!isKeyboardOpen &&
                    <View style={styles['buttton.container']}>
                        {instructions.length !== 0 &&
                            <Button onPress={() => { navigation.navigate("recipe/steps") }} variant="outline" size="medium">
                                Add Step
                            </Button>
                        }
                        <Button onPress={() => { onSave() }} variant={"contain"} size={"medium"}>
                            Save & Continue
                        </Button>
                    </View>
                }
            </KeyboardAvoidingView>
        </Fragment >
    )
}

export default Instructions
