import React, { Fragment, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent, View, TouchableOpacity } from 'react-native';
import { useStyle } from './styles';
import Typography from '../typography';
import { colors } from '../../theme/colors';

export interface ITimeClock {
  initialTime?: string,
  onSelectedTime?: (time: string) => void
}
const TimeClock = ({ initialTime, onSelectedTime }: ITimeClock) => {
  const styles = useStyle();
  const insets = useSafeAreaInsets();
  const hoursScrollViewRef = useRef<ScrollView>(null);
  const minutesScrollViewRef = useRef<ScrollView>(null);
  const ampmScrollViewRef = useRef<ScrollView>(null);
  const [hours, setHours] = useState<number>(0/* new Date().getHours() - 1 */)
  const [minutes, setMinutes] = useState<number>(0/* new Date().getMinutes() */)
  const [ampm, setAmpm] = useState<number>(0/* new Date().getMinutes() */)


  const hoursScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const activeItem = Math.round(offsetY / 40); // 40 is the height of each item
    setHours(activeItem)
  };

  const hoursItemPress = (index: number) => {
    setHours(index)
    hoursScrollViewRef.current?.scrollTo({
      y: index * 40, // Scroll to the item's position
      animated: true,
    });
  };

  const minutesScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const activeItem = Math.round(offsetY / 40); // 40 is the height of each item
    setMinutes(activeItem)
  };

  const minutesItemPress = (index: number) => {
    setMinutes(index)
    minutesScrollViewRef.current?.scrollTo({
      y: index * 40, // Scroll to the item's position
      animated: true,
    });
  };

  const ampmScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const activeItem = Math.round(offsetY / 40); // 40 is the height of each item
    setAmpm(activeItem)
  };

  const ampmItemPress = (index: number) => {
    setAmpm(index)
    ampmScrollViewRef.current?.scrollTo({
      y: index * 40, // Scroll to the item's position
      animated: true,
    });
  };

  return (
    <Fragment>
      <View style={[{
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        display: 'flex',
        flexDirection: "row",
        paddingVertical: 10
      }]}>
        <View style={{ width: 100, alignItems: "center" }}>
          <Typography variant={"SmallTextSemiBold"} color={colors.primary.main}>Hours</Typography>
        </View>
        <View style={{ width: 100, alignItems: "center" }}>
          <Typography variant={"SmallTextSemiBold"} color={colors.primary.main}>Minutes</Typography>
        </View>
        <View style={{ width: 100, alignItems: "center" }}>
          <Typography variant={"SmallTextSemiBold"} color={colors.primary.main}>AM/PM</Typography>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ width: 100, }}>
          <ScrollView
            ref={hoursScrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            snapToInterval={40} // Height of each item
            decelerationRate="fast"
            onScroll={hoursScroll}
            scrollEventThrottle={16} // Throttle scroll events
            pagingEnabled
          >
            {/* Padding for centering */}
            <View style={styles.padding} />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => hoursItemPress(index)} // Handle press
                activeOpacity={0.7}
              >
                <View style={styles.item}>
                  <Typography
                    variant={index === hours ? "MediumTextSemiBold" : "MediumTextRegular"}
                    color={index === hours ? colors.primary.main : colors.grey[400]}
                  >
                    {value}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.padding} />
          </ScrollView>
        </View>
        <View style={{ width: 100, }}>
          <ScrollView
            ref={minutesScrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            snapToInterval={40} // Height of each item
            decelerationRate="fast"
            onScroll={minutesScroll}
            scrollEventThrottle={16} // Throttle scroll events
          >
            {/* Padding for centering */}
            <View style={styles.padding} />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60].map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => minutesItemPress(index)} // Handle press
                activeOpacity={0.7}
              >
                <View style={styles.item}>
                  <Typography
                    variant={index === minutes ? "MediumTextSemiBold" : "MediumTextRegular"}
                    color={index === minutes ? colors.primary.main : colors.grey[400]}
                  >
                    {value}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.padding} />
          </ScrollView>
        </View>
        <View style={{ width: 100, }}>
          <ScrollView
            ref={ampmScrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            snapToInterval={40} // Height of each item
            decelerationRate="fast"
            onScroll={ampmScroll}
            scrollEventThrottle={16} // Throttle scroll events
          >
            {/* Padding for centering */}
            <View style={styles.padding} />
            {["AM", "PM"].map((value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => ampmItemPress(index)} // Handle press
                activeOpacity={0.7}
              >
                <View style={styles.item}>
                  <Typography
                    variant={index === ampm ? "MediumTextSemiBold" : "MediumTextRegular"}
                    color={index === ampm ? colors.primary.main : colors.grey[400]}
                  >
                    {value}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.padding} />
          </ScrollView>
        </View>

        <View style={styles.indicator} />
      </View>
    </Fragment>
  );
}

export default TimeClock;
