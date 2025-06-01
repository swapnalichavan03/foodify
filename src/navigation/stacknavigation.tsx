import React, { Fragment } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard, Notification, Profile, Saved, Create, RecipeDetails, Logout, SearchRecipe, ReviewRecipe, Conversation, ChatRoom, ImagePicker, AddIngredients, AddSteps, VideoPlayer, EditProfile, ShareProfile, UserFollowers, Favorite, SettingsAndActivity, SetNotificationSound, RecipeRating } from '../screens/app';
import { colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppUtils from '../providers/apputils';
import NotificationSetting from '../screens/app/notificationsetting';

const AppStack = createNativeStackNavigator();
const StackNavigation = () => {
  const insets = useSafeAreaInsets();

  return (
    <Fragment>
      <AppStack.Navigator
        screenOptions={{
          orientation: "portrait",
          headerShown: false,
          statusBarBackgroundColor: colors.grey[200],
          statusBarStyle: "dark",
          statusBarTranslucent: true,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: colors.grey[200],
            paddingTop: insets.top,
          }
        }}
      >
        <AppStack.Screen
          name="app/home"
          component={Dashboard}
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />

        <AppStack.Screen
          options={{
            animation: "none",
            gestureEnabled: false,
          }}

          name="app/saved"
          component={Saved}
        />
        <AppStack.Screen
          name="recipe/create"
          component={Create}
          options={{
            animation: "slide_from_bottom",
            gestureEnabled: false,
          }}
        />
        <AppStack.Screen
          name="app/favorite"
          component={Favorite}
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />
        <AppStack.Screen
          options={{
            // animation: "none",
            // gestureEnabled: false,
          }}
          name="app/notification"
          component={Notification}
        />
        <AppStack.Screen
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
          name="user/profile"
          component={Profile}
        />



        <AppStack.Screen
          name="recipe/details"
          component={RecipeDetails}
        />
        <AppStack.Screen
          name="recipe/search"
          component={SearchRecipe}
        />
        <AppStack.Screen
          name="review/recipe"
          component={ReviewRecipe}
        />
        <AppStack.Screen
          name="people/conversation"
          component={Conversation}
        />
        <AppStack.Screen
          name="people/conversation/room"
          component={ChatRoom}
        />
        <AppStack.Screen
          name="camera/picker/image"
          component={ImagePicker}
          options={{
            statusBarBackgroundColor: colors.common.transparent,
            statusBarStyle: "light",
            statusBarTranslucent: true,
            contentStyle: {
              backgroundColor: colors.grey[200],
              paddingTop: 0,
            }
          }}
        />

        <AppStack.Screen
          name="recipe/video/player"
          component={VideoPlayer}
          options={{
            orientation: "all",
            statusBarBackgroundColor: colors.common.transparent,
            statusBarStyle: "light",
            statusBarTranslucent: true,
            statusBarHidden: true, //
            contentStyle: {
              backgroundColor: colors.grey[200],
              paddingTop: 0,
            }
          }}
        />

        <AppStack.Screen
          name='recipe/ingredients'
          component={AddIngredients}
          options={{
            animation: "slide_from_bottom"
          }}
        />
        <AppStack.Screen
          name='recipe/steps'
          component={AddSteps}
          options={{
            animation: "slide_from_bottom"
          }}
        />


        <AppStack.Screen
          name='profile/details/update'
          component={EditProfile}
        />
        <AppStack.Screen
          name='profile/share'
          component={ShareProfile}
          options={{
            animation: "fade",
            presentation: 'transparentModal',
            statusBarBackgroundColor: colors.common.transparent,
            statusBarStyle: "light",
            statusBarTranslucent: true,
            contentStyle: {
              backgroundColor: colors.common.transparent,
              paddingTop: 0,
            }
          }}
        />
        <AppStack.Screen
          name='profile/user/followers'
          component={UserFollowers}
        />
        <AppStack.Screen
          name='app/settings'
          component={SettingsAndActivity}
        />
        <AppStack.Screen
          name='app/setting/notification'
          component={NotificationSetting}
        />
        <AppStack.Screen
          name='app/user/logout'
          component={Logout}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            statusBarBackgroundColor: colors.common.transparent,
            statusBarStyle: "light",
            statusBarTranslucent: true,
            contentStyle: {
              backgroundColor: colors.common.transparent,
              paddingTop: 0,
            }
          }}
        />

        <AppStack.Screen
          component={SetNotificationSound}
          name='aap/notification/sound'
        />
        <AppStack.Screen
          component={RecipeRating}
          name='recipe/review/rating'
        />
      </AppStack.Navigator>
    </Fragment>
  )
}

export default AppUtils(StackNavigation)
