import React, { Fragment } from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../../../assets/onboard'
import { hexToRgb } from '../../../utils/hexToRgb';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../components/button';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import { StorageManager } from '../../../helpers/localstorage/StorageManager';
import { setOnBoard } from '../../../store/reducers/appauth';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

const OnBoard = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  return (
    <Fragment>
      <ImageBackground source={images.onboardimage} resizeMode="cover" style={{ flex: 1 }}>
        <LinearGradient colors={[hexToRgb('#000000', .3), '#000000']} style={StyleSheet.absoluteFill} />
        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top,
          paddingBottom: (insets.bottom + 20) || 50,
        }}>
          <View style={{ flex: 1 }} />
          <View style={{ gap: 25, }}>
            <Typography variant="HeaderTextBold" color={colors.common.white} styles={{ textAlign: "center" }}>Get {`\n`} Cooking</Typography>
            <Typography variant="MediumTextRegular" color={colors.common.white} styles={{ textAlign: "center" }}>
              Simple way to find testy <Typography variant="MediumTextBold" color={colors.primary.main} styles={{ textAlign: "center" }}>
                Recipe
              </Typography>
            </Typography>
            <Button onPress={() => {
              StorageManager.setOnBoard(true);
              dispatch(setOnBoard({ onBoard: true }));
            }}>
              Start Cooking
            </Button>
          </View>
        </View>
      </ImageBackground>
    </Fragment>
  )
}

export default OnBoard
