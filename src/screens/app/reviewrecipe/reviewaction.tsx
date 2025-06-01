import React, { Fragment, Dispatch, SetStateAction } from 'react'
import { TouchableOpacity, } from 'react-native'
import Feather from "react-native-vector-icons/Feather"
import { IReviewrecipe } from './reviewrecipe'

interface IReviewAction {
  setOpenMenu: Dispatch<SetStateAction<{ review: string, _recipe: string, _review: string, images: { url: string, _id: string }[] } | null>>,
  item: IReviewrecipe,
}

const ReviewAction = ({ setOpenMenu, item, }: IReviewAction) => {

  return (
    <Fragment>
      <TouchableOpacity onPress={() => {
        setOpenMenu({ review: item.review, _recipe: item._recipe as string, _review: item._id as string, images: item?.images })
      }} activeOpacity={.50}>
        <Feather name='more-horizontal' size={20} />
      </TouchableOpacity>

    </Fragment>
  );
}

export default ReviewAction;
