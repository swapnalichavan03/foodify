// import React, { useRef, useState } from 'react';
// import { Animated, FlatList, PanResponder, StyleSheet, Text, View } from 'react-native';

// const App = () => {
//     const data = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`); // Sample Data (Adjust for testing)
//     const flatListRef = useRef<FlatList>(null); // Ref for FlatList
//     const scrollY = useRef(new Animated.Value(0)).current;
//     const [scrollBarHeight, setScrollBarHeight] = useState(50); // Default height of scrollbar
//     const [contentHeight, setContentHeight] = useState(1);
//     const [visibleHeight, setVisibleHeight] = useState(1);

//     // Check if scrollbar is needed
//     const isScrollable = contentHeight > visibleHeight;

//     // Scroll Indicator Position
//     const indicatorY = scrollY.interpolate({
//         inputRange: [0, Math.max(1, contentHeight - visibleHeight)],
//         outputRange: [0, Math.max(1, visibleHeight - scrollBarHeight)],
//         extrapolate: 'clamp',
//     });

//     // Gesture Handling for Scrollbar
//     const panResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => isScrollable,
//             onMoveShouldSetPanResponder: () => isScrollable,
//             onPanResponderMove: (_, gesture) => {
//                 if (!isScrollable) return;

//                 const scrollRatio = (contentHeight - visibleHeight) / (visibleHeight - scrollBarHeight);
//                 const newScrollPos = gesture.dy * scrollRatio;

//                 if (flatListRef.current) {
//                     flatListRef.current.scrollToOffset({ offset: newScrollPos, animated: false });
//                 }
//             },
//         })
//     ).current;

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 ref={flatListRef} // Assign ref
//                 showsHorizontalScrollIndicator={false}
//                 showsVerticalScrollIndicator={false}
//                 data={data}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
//                 onScroll={Animated.event(
//                     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//                     { useNativeDriver: false }
//                 )}
//                 onContentSizeChange={(w, h) => setContentHeight(h)}
//                 onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
//                 scrollEventThrottle={16}
//                 contentContainerStyle={{ paddingHorizontal: 20 }}
//             />

//             {/* Custom Scrollbar - Show only if scrollable */}
//             {isScrollable && (
//                 <View style={styles.scrollbarContainer}>
//                     <Animated.View
//                         {...panResponder.panHandlers}
//                         style={[styles.scrollIndicator, { height: scrollBarHeight, transform: [{ translateY: indicatorY }] }]}
//                     />
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { marginVertical: 70, flex: 1, flexDirection: 'row' },
//     item: { padding: 15, fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ddd' },
//     scrollbarContainer: {
//         width: 10,
//         backgroundColor: '#ccc',
//         borderRadius: 5,
//         position: 'absolute',
//         right: 0,
//         top: 0,
//         bottom: 0,
//     },
//     scrollIndicator: {
//         width: 10,
//         backgroundColor: 'blue',
//         borderRadius: 5,
//         position: 'absolute',
//     },
// });

// export default App;




import React, { useRef, useState, useEffect } from 'react';
import { Alert, Animated, FlatList, GestureResponderEvent, PanResponder, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const App = () => {
    const data = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
    const flatListRef = useRef<FlatList>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(1);
    const [visibleHeight, setVisibleHeight] = useState(1);
    const [scrollOffset, setScrollOffset] = useState(0);
    const isScrollable = contentHeight > visibleHeight;

    const scrollBarHeight = isScrollable
        ? (visibleHeight / contentHeight) * visibleHeight
        : 0;

    const indicatorY = scrollY.interpolate({
        inputRange: [0, Math.max(1, contentHeight - visibleHeight)],
        outputRange: [0, Math.max(1, visibleHeight - scrollBarHeight)],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => setScrollOffset(value));
        return () => scrollY.removeListener(listenerId);
    }, []);

    const panResponder =
        PanResponder.create({
            onStartShouldSetPanResponder: () => {
                return isScrollable
            },
            onMoveShouldSetPanResponder: () => {
                return isScrollable
            },
            onPanResponderGrant: () => {
                setScrollOffset(scrollY.__getValue()); // Correctly get the scroll value
            },
            onPanResponderMove: (_, gesture) => {
                if (!isScrollable) return;

                const maxScroll = contentHeight - visibleHeight;
                const maxIndicatorMove = visibleHeight - scrollBarHeight;
                const scrollRatio = maxScroll / maxIndicatorMove;

                let newScrollPos = scrollOffset + gesture.dy * scrollRatio;
                newScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));

                flatListRef.current?.scrollToOffset({ offset: newScrollPos, animated: false });
            }
        })

    // **Click-to-Scroll functionality**
    const handleScrollBarPress = (event: GestureResponderEvent) => {
        if (!isScrollable) return;

        const { locationY } = event.nativeEvent;
        const maxScroll = contentHeight - visibleHeight;
        const maxIndicatorMove = visibleHeight - scrollBarHeight;
        const scrollRatio = maxScroll / maxIndicatorMove;

        // Map the clicked Y position to the scrollable range
        let newScrollPos = locationY * scrollRatio;
        newScrollPos = Math.max(0, Math.min(newScrollPos, maxScroll));

        flatListRef.current?.scrollToOffset({ offset: newScrollPos, animated: true });
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                onContentSizeChange={(w, h) => setContentHeight(h)}
                onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyboardShouldPersistTaps="handled"
                onEndReached={() => {
                    // Alert.alert("END")
                }}
                onEndReachedThreshold={0.5}
            />

            {isScrollable && (
                <View {...panResponder.panHandlers} style={styles.scrollbarContainer}>
                    <Animated.View
                        style={[
                            styles.scrollIndicator,
                            { height: scrollBarHeight, transform: [{ translateY: indicatorY }] }
                        ]}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: 400, marginVertical: 70, flex: 1, flexDirection: 'row' },
    item: { padding: 15, fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    scrollbarContainer: {
        width: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
    },
    scrollIndicator: {
        width: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        position: 'absolute',
    },
});

export default App;
