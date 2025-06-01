import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { usergooglesignin } from '../../service';


interface SignInResponse {
    type: 'success' | "cancelled";
    data: User | null
}
// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: '668721134389-3fbubmad908i9a3j1ek8ekd6h1st21bg.apps.googleusercontent.com', // Web client ID from Firebase
    iosClientId: '668721134389-uemd9ee3lp9evh9o0rua0tc0ittmpus6.apps.googleusercontent.com', // iOS client ID from Google Cloud Console
});

export const onGoogleSignIn = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const signInResult: SignInResponse = await GoogleSignin.signIn();
        // const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.token);

        // Alert.alert(JSON.stringify(signInResult))


        // // Sign in with the credential
        // await auth().signInWithCredential(googleCredential)
        //   .then((response) => {
        //     console.log("response", response)
        //   })
        //   .catch((error) => {
        //     console.log("error", error)
        //   })

        if (signInResult.type === "success") {
            console.log("signInResult", JSON.stringify(signInResult))
            usergooglesignin({ idToken: signInResult.data?.idToken as string })
                .then((response) => {
                    console.log("response.googlelogin", response)
                })
                .catch((error) => {
                    console.log("error.googlelogin", error.response.data)
                })
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error during Google sign-in:', error);
            if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the sign-in flow');
            } else if ((error as any).code === statusCodes.IN_PROGRESS) {
                console.log('Sign-in is already in progress');
            } else if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Google Play Services is not available or outdated');
            } else {
                console.error('Unknown error:', error);
            }
        }
    }
}
