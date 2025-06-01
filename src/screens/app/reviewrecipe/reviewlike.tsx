import React, { Fragment, Dispatch, SetStateAction, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import AntDesign from "react-native-vector-icons/AntDesign"
import { dislikereview, likereview } from '../../../service'
import { IReviewrecipe } from './reviewrecipe'
import { ToasterProps } from '../../../components/toastmessage'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RootState } from '../../../store'

interface IReviewLike {
  setReviews: Dispatch<SetStateAction<IReviewrecipe[]>>,
  item: IReviewrecipe,
  toaster: ToasterProps,
  setToaster: Dispatch<SetStateAction<ToasterProps>>
}

const ReviewLike = ({ setReviews, item, toaster, setToaster, }: IReviewLike) => {
  const { profile } = useAppSelector((state: RootState) => state.userprofile)
  const [isHited, setIsHited] = useState<true | false>(false);

  const onLike = async ({ _recipe, _review, _user, _type }: { _recipe: string, _review: string, _user: string, _type: "like" | "dislike" }) => {
    if (isHited) return
    setIsHited(true)
    await likereview(_recipe, _review, _user, { _type: _type })
      .then((response) => {
        if (response.status === 200) {
          setReviews((prev: IReviewrecipe[]) => {
            const findIndex = prev.findIndex((item: IReviewrecipe) => item._id === _review)
            prev[findIndex] = response.data.data
            return [...prev]
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => { setIsHited(false) })
  };

  const onDislike = async ({ _recipe, _review, _user, }: { _recipe: string, _review: string, _user: string }) => {
    if (isHited) return
    setIsHited(true)
    await dislikereview(_recipe, _review, _user)
      .then((response) => {
        if (response.status === 200) {
          setReviews((prev: IReviewrecipe[]) => {
            const findIndex = prev.findIndex((item: IReviewrecipe) => item._id === _review)
            prev[findIndex] = response.data.data
            return [...prev]
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => { setIsHited(false) })
  };

  return (
    <Fragment>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity
          onPress={() => {
            if (item.likes.find((like) => like._user == profile?._id)?._type === "like") {
              onDislike({ _recipe: item._recipe, _review: item._id, _user: item._creator._id, })
            } else {
              onLike({ _recipe: item._recipe, _review: item._id, _user: item._creator._id, _type: "like" })
            }
          }}
          activeOpacity={0.7}
          style={{
            gap: 10,
            backgroundColor: item.likes.find((like) => like._user == profile?._id) ? item.likes.find((like) => like._user == profile?._id)?._type === "like" ? colors.primary.main : colors.primary.light : colors.primary.light,
            height: 28, width: 55, justifyContent: "center", borderRadius: 55 / 2, display: "flex", flexDirection: "row", alignItems: "center",
          }}>
          <AntDesign name='like1' color={colors.warning.main} size={20} />
          <Typography
            variant="SmallerTextSemiBold"
            color={item.likes.find((like) => like._user == profile?._id) ? item.likes.find((like) => like._user == profile?._id)?._type === "like" ? colors.common.white : colors.neturalcolour.gray_1 : colors.neturalcolour.gray_1}>
            {item.likeCount}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (item.likes.find((like) => like._user == profile?._id)?._type === "dislike") {
              onDislike({ _recipe: item._recipe, _review: item._id, _user: item._creator._id, })
            } else {
              onLike({ _recipe: item._recipe, _review: item._id, _user: item._creator._id, _type: "dislike" })
            }
          }}
          activeOpacity={0.7} style={{
            gap: 10,
            backgroundColor: item.likes.find((like) => like._user == profile?._id) ? item.likes.find((like) => like._user == profile?._id)?._type === "dislike" ? colors.primary.main : colors.primary.light : colors.primary.light,
            height: 28,
            width: 55,
            justifyContent: "center",
            borderRadius: 55 / 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}>
          <AntDesign name='dislike1' color={colors.warning.main} size={20} />
          <Typography
            variant="SmallerTextSemiBold"
            color={item.likes.find((like) => like._user == profile?._id) ? item.likes.find((like) => like._user == profile?._id)?._type === "dislike" ? colors.common.white : colors.neturalcolour.gray_1 : colors.neturalcolour.gray_1}>
            {item.dislikeCount}
          </Typography>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}

export default ReviewLike;
