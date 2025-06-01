import React, { Fragment, useState } from 'react'
import Header from './header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import moment from 'moment'
import Weeks from './week'
import Days from './days'
export interface CalenderProps {
    weekOff?: true | false,
    disablePast?: true | false,
    disableFuture?: true | false,
    selectedDate?: null | string | undefined,
    onSelectDate?: (value: string) => void,
    holidays?: string[]
}
const Calender = ({
    weekOff = false,
    disablePast = false,
    disableFuture = false,
    selectedDate = null,
    onSelectDate,
    holidays = [],
}: CalenderProps) => {
    const insets = useSafeAreaInsets();
    const [currentDate, setCurrentDate] = useState(selectedDate ? moment(selectedDate).format() : moment().format());
    const [currentMonth, setCurrentMonth] = useState<number>(Number(moment(currentDate).format("MM")));
    const [currentYear, setCurrentYear] = useState<number>(Number(moment(currentDate).format("yyyy")))
    const [isYears, setIsYears] = useState<true | false>(false);

    const onChangeDate = (date: string) => {
        if (onSelectDate) {
            onSelectDate(moment(date).format());
        }
        setCurrentDate(moment(date).format());
    }

    return (
        <Fragment>
            <Header
                disablePast={disablePast}
                disableFuture={disableFuture}
                currentYear={currentYear}
                isYears={isYears}
                currentMonth={currentMonth}
                setCurrentYear={setCurrentYear}
                setCurrentMonth={setCurrentMonth}
                setIsYears={setIsYears}
            />
            <Weeks 

            />
            <Days
                currentDate={currentDate}
                disablePast={disablePast}
                disableFuture={disableFuture}
                weekOff={weekOff}
                holidays={holidays}
                isYears={isYears}
                currentMonth={currentMonth}
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
                setIsYears={setIsYears}
                setCurrentMonth={setCurrentMonth}
                onChangeDate={onChangeDate}
            />
        </Fragment>
    )
}

export default Calender








// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import Animated, {
//     useSharedValue,
//     useAnimatedStyle,
//     interpolate,
//     Extrapolate,
//     runOnJS
// } from 'react-native-reanimated';
// import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

// const { width } = Dimensions.get('window');

// const ITEM_HEIGHT = 50; // Height of each item
// const VISIBLE_ITEMS = 5; // Number of visible items in the picker

// // Reusable Scroll Wheel Component
// const ScrollWheel = ({ data, onSelect, selectedValue }) => {
//     const translateY = useSharedValue(0);

//     const handleScroll = Gesture.Pan()
//         .onUpdate((e) => {
//             translateY.value = Math.max(
//                 Math.min(translateY.value + e.translationY, 0),
//                 -(data.length - 1) * ITEM_HEIGHT
//             );
//         })
//         .onEnd(() => {
//             const index = Math.round(-translateY.value / ITEM_HEIGHT);
//             translateY.value = -index * ITEM_HEIGHT;

//             if (onSelect && typeof onSelect === 'function') {
//                 runOnJS(onSelect)(data[index]);
//             }
//         });

//     return (
//         <GestureHandlerRootView>
//             <GestureDetector gesture={handleScroll}>
//                 <Animated.View style={styles.scrollContainer}>
//                     {data.map((item, index) => {
//                         const itemOffset = ITEM_HEIGHT * index;

//                         const animatedStyle = useAnimatedStyle(() => {
//                             const scale = interpolate(
//                                 translateY.value + itemOffset,
//                                 [-ITEM_HEIGHT * VISIBLE_ITEMS, 0, ITEM_HEIGHT * VISIBLE_ITEMS],
//                                 [0.8, 1, 0.8],
//                                 Extrapolate.CLAMP
//                             );

//                             const translateYInterpolated = interpolate(
//                                 translateY.value + itemOffset,
//                                 [-ITEM_HEIGHT * VISIBLE_ITEMS, 0, ITEM_HEIGHT * VISIBLE_ITEMS],
//                                 [-20, 0, 20],
//                                 Extrapolate.CLAMP
//                             );

//                             const opacity = interpolate(
//                                 translateY.value + itemOffset,
//                                 [-ITEM_HEIGHT * VISIBLE_ITEMS, 0, ITEM_HEIGHT * VISIBLE_ITEMS],
//                                 [0.5, 1, 0.5],
//                                 Extrapolate.CLAMP
//                             );

//                             return {
//                                 transform: [
//                                     { perspective: 400 },
//                                     { translateY: translateYInterpolated },
//                                     { scale },
//                                 ],
//                                 opacity,
//                             };
//                         });

//                         return (
//                             <Animated.View key={index} style={[styles.item, animatedStyle]}>
//                                 <Text
//                                     style={[
//                                         styles.text,
//                                         selectedValue === item && { color: '#007BFF', fontWeight: 'bold' },
//                                     ]}
//                                 >
//                                     {item}
//                                 </Text>
//                             </Animated.View>
//                         );
//                     })}
//                 </Animated.View>
//             </GestureDetector>
//         </GestureHandlerRootView>
//     );
// };

// // Main Time Picker Component
// const Calender = () => {
//     const hours = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
//     const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
//     const periods = ['AM', 'PM'];

//     const [selectedHour, setSelectedHour] = useState(hours[0]);
//     const [selectedMinute, setSelectedMinute] = useState(minutes[0]);
//     const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

//     return (
//         <View style={styles.container}>
//             <View style={styles.pickerRow}>
//                 {/* Hour Picker */}
//                 <ScrollWheel
//                     data={hours}
//                     selectedValue={selectedHour}
//                     onSelect={setSelectedHour}
//                 />

//                 {/* Minute Picker */}
//                 <ScrollWheel
//                     data={minutes}
//                     selectedValue={selectedMinute}
//                     onSelect={setSelectedMinute}
//                 />

//                 {/* AM/PM Picker */}
//                 <ScrollWheel
//                     data={periods}
//                     selectedValue={selectedPeriod}
//                     onSelect={setSelectedPeriod}
//                 />
//             </View>

//             <View style={styles.selectedTime}>
//                 <Text style={styles.selectedTimeText}>
//                     {selectedHour}:{selectedMinute} {selectedPeriod}
//                 </Text>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5F5F5',
//     },
//     pickerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         width: width * 0.9,
//     },
//     scrollContainer: {
//         height: ITEM_HEIGHT * VISIBLE_ITEMS,
//         overflow: 'hidden',
//     },
//     item: {
//         height: ITEM_HEIGHT,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         fontSize: 24,
//         color: '#000',
//     },
//     selectedTime: {
//         marginTop: 30,
//     },
//     selectedTimeText: {
//         fontSize: 30,
//         fontWeight: 'bold',
//     },
// });

// export default Calender;
