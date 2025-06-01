import React, { Fragment, useEffect, } from 'react'
import Navigation from './navigation'
import SafeArea from './providers/safeareaprovider'
import NavigationProvider from './providers/navigation'
import ReduxProvider from './providers/storeprovider'
import ErrorBoundary from './providers/errorboundary/ErrorBoundary'
import { Platform } from 'react-native'
// import Appcenter from './providers/appcenter'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import branch from 'react-native-branch'

const setup_permissions = async (permissions: string[]) => {
  const platformPermissions: Record<string, string | undefined> = {
    Camera: Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }),
    LocationAccuracy: Platform.select({ ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE }),
    LocationAlways: Platform.select({ ios: PERMISSIONS.IOS.LOCATION_ALWAYS, android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION }),
    LocationWhenInUse: Platform.select({ ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION }),
    PhotoLibrary: Platform.select({ ios: PERMISSIONS.IOS.PHOTO_LIBRARY, android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE }),
  };

  for (const permission of permissions) {
    const permissionType = platformPermissions[permission];

    if (permissionType) {
      const result = await request(permissionType);

      if (result !== RESULTS.GRANTED) {
        console.warn(`${permission} permission denied:`, result);
      }
    }
  }
};

const App = () => {

  // useEffect(() => {
  //   setup_permissions([
  //     'Camera',
  //     'LocationAccuracy',
  //     'LocationAlways',
  //     'LocationWhenInUse',
  //     'PhotoLibrary',
  //   ]);
  // }, []);

  useEffect(() => {
    // branch.subscribe({
    //   onOpenStart: ({ uri, cachedInitialEvent }) => {
    //     // cachedInitialEvent is true if the event was received by the
    //     // native layer before JS loaded.
    //     console.log(
    //       'Branch subscribe onOpenStart, will open ' +
    //       uri +
    //       ' cachedInitialEvent is ' +
    //       cachedInitialEvent,
    //     );
    //   },
    //   onOpenComplete: ({ error, params, uri }) => {
    //     console.log("params", params)
    //     if (error) {
    //       console.log(
    //         'Branch subscribe onOpenComplete, Error from opening uri: ' +
    //         uri +
    //         ' error: ' +
    //         error,
    //       );
    //       return;
    //     }

    //   },
    // });

    const unsubscribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error("Branch Error:", error);
        return;
      }
      console.log("Branch Params:", params);
      if (params && params["+clicked_branch_link"]) {
        // Handle navigation based on deep link
      }
    });

    return () => {
      unsubscribe();
    };

  }, [])


  return (
    <Fragment>
      {/* <Appcenter> */}
      <ErrorBoundary>
        <ReduxProvider>
          <SafeArea>
            <NavigationProvider>
              <Navigation />
            </NavigationProvider>
          </SafeArea>
        </ReduxProvider>
      </ErrorBoundary>
      {/* </Appcenter> */}
    </Fragment>
  )
}

export default App

///////

// export default codePush({
//   // checkFrequency: codePush.CheckFrequency.MANUAL,
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//   updateDialog: {
//     title: "Update Available",
//     optionalUpdateMessage: "A new update is available. Would you like to install it?",
//     optionalInstallButtonLabel: "Install",
//     optionalIgnoreButtonLabel: "Ignore",
//     mandatoryUpdateMessage: "A critical update is available and must be installed.",
//     mandatoryContinueButtonLabel: "Continue",
//   },
//   installMode: codePush.InstallMode.IMMEDIATE, // Change to ON_NEXT_RESTART if you want to apply updates later
// })(App)


// const splitTextIntoChunks = (text: string, linesPerChunk: number) => {
//   const lines = text.split('\n'); // Split text by new lines
//   const chunks = [];
//   for (let i = 0; i < lines.length; i += linesPerChunk) {
//     chunks.push(lines.slice(i, i + linesPerChunk).join('\n'));
//   }
//   return chunks;
// };

// const ReadMoreText = ({ readMoreStyle, text, textStyle }) => {
//   const [visibleChunks, setVisibleChunks] = React.useState(1);
//   const chunks = splitTextIntoChunks(text, 3);

//   const handleAddMore = () => {
//     if (visibleChunks < chunks.length) {
//       setVisibleChunks(visibleChunks + 1);
//     }
//   };

//   console.log(visibleChunks)

//   return (
//     <>
//       <Text numberOfLines={3} style={textStyle} ellipsizeMode="tail">
//         {text}
//       </Text>

//       {visibleChunks === 1 ? (
//         <Text onPress={handleAddMore} style={readMoreStyle}>
//           {visibleChunks === 1 ? 'Read Less' : 'Read More'}
//         </Text>
//       ) : null}
//     </>
//   );
// };

// import React from 'react';
// import { Text } from "react-native";

// const App = () => {
//   return (
//     <ReadMoreText
//       text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`}
//     />
//   );
// }

// export default App;