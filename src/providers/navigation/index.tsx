import React, { Fragment } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { linking } from '../../utils/linking'
import { ActivityIndicator, Platform, StatusBar, View } from 'react-native'
import { colors } from '../../theme/colors'

const NavigationProvider = ({ children }: { children?: React.ReactNode }) => {

    return (
        <Fragment>
            <NavigationContainer
                linking={linking}
                fallback={
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.grey[200] }}>
                        {Platform.OS === "android" &&
                            <StatusBar animated barStyle={"dark-content"} backgroundColor={colors.grey[200]} />
                        }
                        <ActivityIndicator size={"large"} color={colors.primary.main} />
                    </View>
                }
            >
                {children}
            </NavigationContainer>
        </Fragment>
    )
}

export default NavigationProvider
