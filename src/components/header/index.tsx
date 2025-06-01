import React, { Fragment } from 'react'
import { headerProps } from './header'
import { TouchableOpacity, View } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../../theme/colors'
import Typography from '../typography'
import { useNavigation } from '@react-navigation/native'

const Header = ({ title, isBack, rightAction, leftAction }: headerProps) => {
  const navigation = useNavigation();

  return (
    <Fragment>
      <View style={{ gap: 10, height: 45, paddingHorizontal: 20, backgroundColor: colors.grey[200], display: "flex", flexDirection: "row", alignItems: "center" }}>
        {isBack &&
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.5}>
            <Ionicons name='arrow-back' color={colors.text.primary} size={20} />
          </TouchableOpacity>
        }
        {title &&
          <Typography variant="MediumTextRegular" styles={{ textAlign: "center" }}>{title}</Typography>
        }
        <View style={{ flex: 1 }} />
      </View>
    </Fragment>
  )
}

export default Header
