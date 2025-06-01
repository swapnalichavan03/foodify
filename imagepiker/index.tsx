// import React, { Fragment, useEffect, useState } from 'react';
// import { Modal, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
// import { colors } from '../src/theme/colors';
// import Button from '../src/components/button';
// import MultipleImage from './multipleimage';
// import SingleImage from './singleimage';
// import SafeArea from '../src/providers/safeareaprovider';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useDeviceMediaByFolder } from '../src/hooks/useDeviceMediaByFolder';
// import { useDeiceMediaFolders } from '../src/hooks/useDeiceMediaFolders';
// import Typography from '../src/components/typography';

// const RNImagePiker = () => {
//     const { media, getMedia } = useDeviceMediaByFolder()
//     const { folders } = useDeiceMediaFolders({})
//     const insets = useSafeAreaInsets();
//     const [isPicker, setIsPicker] = useState(false);
//     const [singleIsPicker, setIsSinglePicker] = useState(false);

//     useEffect(() => {
//         getMedia({})
//     }, []);

//     console.log("media", media)

//     return (
//         <Fragment>
//             <View style={{ paddingTop: insets.top, flex: 1, gap: 10, justifyContent: "center", backgroundColor: colors.grey[300], paddingHorizontal: 20, }}>

//                 <View>
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{ gap: 10 }}
//                     >
//                         {folders.map((value, index) => {
//                             return (
//                                 <Fragment key={index}>
//                                     {index === 0 &&
//                                         <TouchableOpacity onPress={() => { getMedia({}) }} style={{ backgroundColor: colors.grey[400], paddingVertical: 10, paddingHorizontal: 5 }}>
//                                             <Typography variant="SmallerTextSemiBold" color={colors.grey[900]}>All</Typography>
//                                         </TouchableOpacity>
//                                     }
//                                     <TouchableOpacity onPress={() => { getMedia({ folder: value.title }) }} style={{ backgroundColor: colors.grey[400], paddingVertical: 10, paddingHorizontal: 5 }}>
//                                         <Typography variant="SmallerTextSemiBold" color={colors.grey[900]}>{value.title} {value.count}</Typography>
//                                     </TouchableOpacity>
//                                 </Fragment>
//                             )
//                         })}
//                     </ScrollView>
//                 </View>

//                 <Button onPress={() => setIsPicker(true)}>Pick Multiple Image</Button>
//                 <Button onPress={() => setIsSinglePicker(true)}>Pick Single Image</Button>
//             </View>

//             <MultipleImage
//                 visible={isPicker}
//                 onRequestClose={() => {
//                     setIsPicker(false)
//                 }}
//             />
//             <SingleImage
//                 visible={singleIsPicker}
//                 onRequestClose={() => {
//                     setIsSinglePicker(false)
//                 }}
//             />
//         </Fragment>
//     );
// }



// const App = () => (
//     <SafeArea>
//         <RNImagePiker />
//     </SafeArea>
// )

// export default App;

import React, { Fragment } from 'react';
import { Text, View } from 'react-native';

const App = () => {
    return (
        <Fragment>
            <View style={{ height: 200 }} />

            <View
                style={{
                    flexDirection: "row",
                    gap: 10,
                    padding: 16
                }}
            >
                <View>
                    <View style={{ width: 40, height: 40, backgroundColor: "red" }} />
                </View>
                
                <View style={{ flex: 1, gap: 10 }}>
                    <View>
                        <Text style={{}} numberOfLines={3}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                        </Text>
                    </View>
                    <View>
                        <Text style={{}} numberOfLines={3}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur?
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={{ width: 40, height: 40, backgroundColor: "red" }} />
                </View>
                <View>
                    <View style={{ width: 40, height: 40, backgroundColor: "red" }} />
                </View>
            </View>


        </Fragment>
    );
}

export default App;

