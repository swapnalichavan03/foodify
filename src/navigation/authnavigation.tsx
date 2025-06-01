import React, { Fragment } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginMethod, SignIn, SignUp, Verification, Forgotpassword, FindUser, } from '../screens/auth';
import { colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AuthStack = createNativeStackNavigator();
const AuthNavigation = () => {
    const insets = useSafeAreaInsets();

    return (
        <Fragment>
            <AuthStack.Navigator
                screenOptions={{
                    headerShown: false,
                    statusBarBackgroundColor: colors.grey[200],
                    statusBarStyle: "dark",
                    statusBarTranslucent: true,
                    animation: "slide_from_right",
                    contentStyle: {
                        backgroundColor: colors.grey[200],
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom
                    }
                }}
            >
                <AuthStack.Screen
                    name="auth/signin/method"
                    component={LoginMethod}
                    options={{
                        statusBarStyle: "light",
                        statusBarTranslucent: true,
                        statusBarBackgroundColor: colors.common.transparent
                    }}
                />
                <AuthStack.Screen name="auth/signin" component={SignIn} />
                <AuthStack.Screen name="auth/signup" component={SignUp} />
                <AuthStack.Screen name="otp/verification" component={Verification} />
                <AuthStack.Screen name="forgot/password" component={Forgotpassword} />
                <AuthStack.Screen name="user/find" component={FindUser} />
            </AuthStack.Navigator>
        </Fragment>
    )
}

export default AuthNavigation
