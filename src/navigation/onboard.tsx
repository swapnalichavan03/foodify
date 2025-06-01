import React, { Fragment } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { OnBoard } from '../screens/onboard';

const OnboardStack = createNativeStackNavigator();
const OnBoardNavigation = () => {

  return (
    <Fragment>
      <OnboardStack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarBackgroundColor: colors.common.transparent,
          statusBarStyle: "light",
          statusBarTranslucent: true,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: colors.grey[200],
            
          }
        }}
      >
        <OnboardStack.Screen name="app/onboard" component={OnBoard} />
      </OnboardStack.Navigator>
    </Fragment>
  )
}

export default OnBoardNavigation
