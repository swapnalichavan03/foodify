import { Linking } from 'react-native';
import { LinkingOptions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';


const NAVIGATION_IDS: string[] = ['customer/dashboard', 'transaction/history', 'loan/schemes', 'loan/repay', 'loan/renew', 'user/profile', 'loan/calculator', 'customer/support',];
function buildDeepLinkFromNotificationData(data: any): string | null {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    return null;
  }
  if (navigationId === 'home') {
    return 'app://foodify.app/home';
  }
  if (navigationId === 'settings') {
    return 'app://foodify.app/settings';
  }
  const postId = data?.postId;
  if (typeof postId === 'string') {
    return `app://foodify.app/post/${postId}`
  }
  return null
}

export type RootStackParamList = {
  ["app/onboard"]: undefined,
  ["auth/signin/method"]: undefined,
  ["auth/signin"]: undefined,
  ["auth/signup"]: undefined,
  ["otp/verification"]: undefined,
  ["forgot/password"]: undefined,
  ["user/find"]: undefined,
  ["app/home"]: undefined,
  ["app/saved"]: undefined,
  ["recipe/create"]: { _recipe: string, _creator: string },
  ["app/notification"]: undefined,
  ["app/favorite"]: { _user: string },
  ["user/profile"]: { _user: string },
  ["recipe/details"]: { _recipe: string, _user: string },
  ["recipe/search"]: undefined,
  ["review/recipe"]: { _recipe: string, _user: string },
  ["people/conversation"]: undefined,
  ["people/conversation/room"]: { _people: string },
  ["camera/picker/image"]: { name: "recipe" | "instructions" | "ingredients" | "profile" | "appliances" | "review" },
  ["recipe/ingredients"]: undefined,
  ["recipe/steps"]: undefined,
  ["recipe/video/player"]: { _url: string, _recipe: string },

  ["profile/details/update"]: { _user: string, name: string },
  ["profile/share"]: { _user: string, name: string },
  ["profile/user/followers"]: { _user: string, name: string, tab: "followers" | "following", totalfollowers: number, totalfollowing: number },
  ["app/settings"]: undefined,
  ["app/setting/notification"]: undefined,
  ["app/user/logout"]: undefined,
  ["aap/notification/sound"]: { notification: "Recipe" | "Follower" },
  ["recipe/review/rating"]: { _recipe: string, _user: string },
};

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['foodify://', 'https://gc4cu.test-app.link', 'https://gc4cu-alternate.test-app.link', 'https://foodify-server-kappa.vercel.app'],
  config: {
    screens: {
      ["auth/signin"]: { path: "auth/signin", },
      ["auth/signup"]: { path: "auth/signup", },
      ["otp/verification"]: { path: "otp/verification", },
      ["forgot/password"]: { path: "forgot/password", },
      ["user/find"]: { path: "user/find", },
      ["app/home"]: { path: "app/home" },
      ["app/saved"]: { path: "app/saved" },
      ["recipe/create"]: { path: "recipe/create" },
      ["app/notification"]: { path: "app/notification" },
      ["user/profile"]: { path: "user/profile/:_user" },
      ["recipe/details"]: { path: "recipe/details/:_recipe/:_user" },

    }
  },

  
  // async getInitialURL() {
  //   const url = await Linking.getInitialURL();
  //   if (typeof url === 'string') {
  //     return url;
  //   }
  //   //getInitialNotification: When the application is opened from a quit state.
  //   const message = await messaging().getInitialNotification();
  //   const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
  //   if (typeof deeplinkURL === 'string') {
  //     return deeplinkURL;
  //   }
  // },
  // subscribe(listener: (url: string) => void) {
  //   const onReceiveURL = ({ url }: { url: string }) => listener(url);

  //   // Listen to incoming links from deep linking
  //   const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

  //   //onNotificationOpenedApp: When the application is running, but in the background.
  //   const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log("remoteMessage", remoteMessage)
  //     const url = buildDeepLinkFromNotificationData(remoteMessage.data)
  //     if (typeof url === 'string') {
  //       listener(url)
  //     }
  //   });

  //   return () => {
  //     linkingSubscription.remove();
  //     unsubscribe();
  //   };
  // },
}