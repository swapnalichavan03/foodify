import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder, NativeEventEmitter, NativeModules, Alert, ActivityIndicator, Platform, Text, Modal, FlatList, StatusBar } from 'react-native';
import Video, { VideoRef, type OnLoadData, type OnProgressData } from 'react-native-video';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../../utils/linking';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import Slider from '@react-native-community/slider';
import { useScreenOrientation } from '../../../utils/screenorientation';
import { convertTime } from '../../../utils/convertTime';
import { useStyles } from './styles';

const { width } = Dimensions.get('window');

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/video/player">
type RouteProps = RouteProp<RootStackParamList, "recipe/video/player">
const VideoPlayer = () => {
  const styles = useStyles();
  const lastTapRef = useRef<number | null>(null);
  const navigation = useNavigation<NavigationProps>();
  const { orientation: screenOrientation } = useScreenOrientation();
  const [onRate, setOnRate] = useState<true | false>(false);
  const [rate, setRate] = useState<"0.5" | "1.0" | "1.25" | "1.5" | "2.0">('1.0')
  const route = useRoute<RouteProps>();
  const videoRef = useRef<VideoRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.0);
  const [muted, setMuted] = useState(false);
  const [brightness, setBrightness] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState<true | false>(false)
  const [controlsVisible, setControlsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const initialVolume = useRef(volume);
  const initialBrightness = useRef(brightness);
  const [isPlaying, setIsPlaying] = useState<true | false>(true);
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(100)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const toggleControls = () => {
  //   Animated.parallel([
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(translateX, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();

  //   if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

  //   hideTimeoutRef.current = setTimeout(() => {
  //     Animated.parallel([
  //       Animated.timing(translateY, {
  //         toValue: -100,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(translateX, {
  //         toValue: 100,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }, 5000);
  // };

  // useEffect(() => {
  //   return () => {
  //     if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  //   };
  // }, []);


  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const showControls = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setControlsVisible(true);

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = setTimeout(hideControls, 5000);
  };

  const hideControls = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setControlsVisible(false);
    });
  };

  const toggleControls = () => {
    if (controlsVisible) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideControls();
    } else {
      showControls();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.seek(currentTime + 10);
    }
  }
  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.seek(Math.max(0, currentTime - 10))
    }
  };

  const onProgress = (data: OnProgressData) => {
    if (videoRef.current) {
      setCurrentTime(data.currentTime)
    }
  };
  const onLoad = (data: OnLoadData) => {
    if (videoRef.current) {
      setDuration(data.duration)
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        initialVolume.current = volume;
        initialBrightness.current = brightness;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy, moveX } = gestureState;
        const { locationY } = evt.nativeEvent;

        // Determine if the gesture is Horizontal or Vertical
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal Swipe
          if (locationY < Dimensions.get('window').height / 2) {
            // Top Half Horizontal -> Adjust Playback Speed
            if (dx > 30) {
              if (videoRef.current) {
                // videoRef.current?.setNativeProps({ rate: 1.5 });
              }
            } else if (dx < -30) {
              console.log('Top Half Left Swipe: Decrease Playback Speed');
            }
          } else {
            // Bottom Half Horizontal -> Video Seeking
            if (dx > 10) {
              if (videoRef.current) {
                videoRef.current.seek(currentTime + dx * 0.1); // Forward dynamically
              }
            } else if (dx < -10) {
              if (videoRef.current) {
                videoRef.current.seek(Math.max(0, currentTime + dx * 0.1)); // Rewind dynamically
              }
            }
          }
        }
        // Vertical Swipes
        else {
          if (moveX < width / 2) {
            // Left Side -> Brightness Control
            if (dy > 10) {
              setBrightness((prev) => Math.max(0, prev - 0.05)); // Decrease Brightness
            } else if (dy < -10) {
              setBrightness((prev) => Math.min(1, prev + 0.05)); // Increase Brightness
            }
          } else {
            // Right Side -> Volume Control
            if (dy > 10) {
              setVolume((prev) => Math.max(0, prev - 0.05)); // Decrease Volume
            } else if (dy < -10) {
              setVolume((prev) => Math.min(1, prev + 0.05)); // Increase Volume
            }
          }
        }
      },
      onPanResponderRelease: () => {
        initialVolume.current = volume;
        initialBrightness.current = brightness;
      },
    })
  ).current;

  const handleDoubleTap = (evt: any) => {
    const now = Date.now();
    const { locationX, locationY } = evt.nativeEvent;
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    if (lastTapRef.current && now - lastTapRef.current < 300) {
      let zone = '';

      if (locationY < screenHeight * 0.33) {
        zone = 'Top Zone';
      } else if (locationY > screenHeight * 0.66) {
        zone = 'Bottom Zone';
      } else if (locationX < screenWidth * 0.5) {
        // zone = 'Left Zone';
        handleRewind()
      } else {
        // zone = 'Right Zone';
        handleForward()
      }

      // Alert.alert(`Double Tap Detected`, `You tapped on the ${zone}`);
    }

    lastTapRef.current = now;
  };

  // useEffect(() => {
  //   if (screenOrientation === "landscape") {
  //     navigation.setOptions({
  //       statusBarAnimation: "slide",
  //       statusBarTranslucent: true,
  //       statusBarBackgroundColor: colors.common.transparent,
  //       statusBarHidden: true
  //     })
  //   }
  // }, [screenOrientation])

  return (
    <Fragment>
      <StatusBar hidden={true} />
      <GestureHandlerRootView style={styles.container}>
        <Pressable style={styles.videoContainer} onTouchStart={handleDoubleTap} onPress={toggleControls} {...panResponder.panHandlers}>
          {route.params._url &&
            <Video
              ref={videoRef}
              source={{ uri: route.params._url }}
              style={styles.video}
              paused={!isPlaying}
              onProgress={onProgress}
              onLoad={onLoad}
              volume={volume}
              resizeMode="contain"
              onError={(error) => {
                console.log("video.error", error)
              }}
              onLoadStart={() => {

              }}

              muted={muted}
              pictureInPicture={true}
              playInBackground={true}
              playWhenInactive={true}
              fullscreenAutorotate={true}
              fullscreenOrientation="all"
              audioOutput="speaker"
              controls={false}
              onEnd={() => { navigation.goBack() }}
              onPictureInPictureStatusChanged={(event) => {
                console.log('PiP status:', event);
              }}
              rate={Number(rate)}
            // renderLoader={() => {
            //   return (
            //     <View style={[StyleSheet.absoluteFill, {alignItems: "center", justifyContent: "center"}]}>
            //       <ActivityIndicator size={"large"} color={colors.primary.main} />
            //     </View>
            //   )
            // }}
            />
          }
        </Pressable>

        <Fragment>
          <Animated.View style={[{ transform: [{ translateY: translateY }], }, styles['control.headeSection.container']]}>
            <View style={styles['headeSection.itemContainer']}>
              <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <AntDesign name={"arrowleft"} size={20} color={colors.common.white} />
              </TouchableOpacity>
              <Typography numberOfLines={1} variant="SmallTextRegular" color={colors.common.white} styles={{ flex: 1 }}>
                {route.params._recipe}
              </Typography>
              <TouchableOpacity onPress={() => { setMuted(!muted) }}>
                <Octicons name={muted ? "mute" : "unmute"} size={20} color={colors.common.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View style={[{ opacity: fadeAnim }, styles['control.centerSection.container']]}>
            <View style={styles['centerSection.itemContainer']}>
              <TouchableOpacity onPress={() => { handleRewind() }} activeOpacity={0.60} style={styles['centerSection.control.buttons']}>
                <MaterialIcons name="replay-10" size={40} color={colors.common.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { togglePlayPause() }} activeOpacity={0.60} style={styles['centerSection.control.buttons']}>
                <FontAwesome6 name={!isPlaying ? "circle-play" : "circle-pause"} size={40} color={colors.common.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { handleForward() }} activeOpacity={0.60} style={styles['centerSection.control.buttons']}>
                <MaterialIcons name="forward-10" size={40} color={colors.common.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View style={[{ transform: [{ translateY: translateX }], }, styles['control.bottomSection.container']]}>
            <View style={styles['bottomSection.itemContainer']}>
              <TouchableOpacity onPress={() => {
                navigation.setOptions({ "orientation": screenOrientation === "portrait" ? "landscape" : "portrait" })
                setIsFullscreen(!isFullscreen)
              }} activeOpacity={.50}>
                <MaterialIcons name={screenOrientation === "portrait" ? "fullscreen" : "fullscreen-exit"} size={20} color={colors.common.white} />
              </TouchableOpacity>
              <Typography variant="SmallerTextRegular" color={colors.common.white} styles={{ width: 50, textAlign: "center" }}>
                {convertTime(Number(currentTime.toFixed(0)))}
              </Typography>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime}
                onSlidingComplete={(value) => {
                  if (videoRef.current) {
                    videoRef.current.seek(value)
                  }
                }}
                minimumTrackTintColor="#FFF"
                maximumTrackTintColor="#777"
              />
              <Typography variant="SmallerTextRegular" color={colors.common.white} styles={{ width: 50, textAlign: "center" }}>
                {convertTime(Number(duration.toFixed(0)))}
              </Typography>
              <TouchableOpacity onPress={() => {
                setOnRate(!onRate)
              }} activeOpacity={.50}>
                <MaterialIcons name={"more-vert"} size={20} color={colors.common.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Fragment>

        <Modal
          visible={onRate}
          transparent
        >
          <View style={styles['playbackspeed.modal']}>
            <TouchableOpacity onPress={() => { console.log("object"); setOnRate(false) }} activeOpacity={0.60} style={[StyleSheet.absoluteFill]} />
            <View style={styles['playbackspeed.container']}>
              <View style={styles['playbackspeed.headerText']}>
                <Typography variant="SmallTextSemiBold">Playback speed</Typography>
              </View>

              <FlatList
                data={["0.5", "1.0", "1.25", "1.5", "2.0"]}
                renderItem={({ item }: { item: "0.5" | "1.0" | "1.25" | "1.5" | "2.0" }) => {
                  return (
                    <TouchableOpacity onPress={() => { setRate(item) }} style={styles['playbackspeed.itemContainer']}>
                      <Typography variant={rate === item ? "SmallTextSemiBold" : "SmallTextRegular"}>{item}x</Typography>
                    </TouchableOpacity>
                  )
                }}
                ItemSeparatorComponent={() => <View style={styles['playbackspeed.ItemSeparator']} />}
              />
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </Fragment>
  );
}

export default VideoPlayer;
