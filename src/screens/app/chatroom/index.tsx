import React, { Fragment, useEffect, useState } from 'react'
import { FlatList, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import Typography from '../../../components/typography';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = -50;


interface chatProps {
    id: number,
    type: "text" | "media" | "textmedia",
    mediaType?: "image" | "video",
    mediaUrl?: string,
    message?: string,
    sender: string,
    replyTo?: number,
    timestamp: string,
    forwarded?: true | false,
    isEdit?: true | false,
    isReacted: true | false,
    reactEmoji: string,
    status: "send" | "seen" | "deliver"
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "people/conversation/room">
const ChatRoom = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp>();
    const [message, setMessage] = useState<string>();
    const [isStar, setIsStar] = useState<true | false>(true);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<chatProps | null>(null);
    const [onReplayMessage, setOnReplayMessage] = useState<chatProps | null>(null)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const getstatus = {
        send: <Ionicons name='checkmark' color={colors.neturalcolour.gray_2} size={18} />,
        seen: <Ionicons name='checkmark-done' color={colors.primary.main} size={18} />,
        deliver: <Ionicons name='checkmark-done' color={colors.neturalcolour.gray_2} size={18} />,
    }
    const ChatMessage = ({ item }: { item: chatProps }) => {
        const isMedia = item.type === 'media' || item.type === "textmedia";
        const translateX = useSharedValue(0);
        const showReplyIcon = useSharedValue(false);

        const gestureHandler = useAnimatedGestureHandler({
            onActive: (event) => {
                if (event.translationX < 0) return; // prevent left swipe
                translateX.value = event.translationX;

                if (event.translationX > Math.abs(SWIPE_THRESHOLD)) {
                    showReplyIcon.value = true;
                }
            },
            onEnd: () => {
                if (translateX.value > Math.abs(SWIPE_THRESHOLD)) {
                    runOnJS(setOnReplayMessage)(item); // trigger your reply logic
                }
                translateX.value = withTiming(0);
                showReplyIcon.value = false;
            },
        });

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));

        const replyIconStyle = useAnimatedStyle(() => ({
            opacity: showReplyIcon.value ? withTiming(1) : withTiming(0),
        }));

        return (
            <Fragment>
                <GestureHandlerRootView>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={[animatedStyle, styles.messageWrapper]}>
                            <TouchableOpacity activeOpacity={0.7} onLongPress={() => { setSelectedMessage(item) }} style={[styles.messageContainer, item.sender === 'Alice' ? styles.left : styles.right]}>
                                {item.forwarded && (
                                    <Text style={styles.forwardedText}>Forwarded</Text>
                                )}

                                {item.replyTo && (
                                    <View style={styles.replyContainer}>

                                        <Text style={styles.replyUserText}>{chatData.find((value: chatProps) => value.id === item.replyTo)?.sender}</Text>
                                        <Text style={styles.replyText}>{chatData.find((value: chatProps) => value.id === item.replyTo)?.message}</Text>
                                    </View>
                                )}

                                {isMedia && (
                                    item.mediaType === 'image' ? (
                                        <Fragment>
                                            <Image source={{ uri: item.mediaUrl }} style={styles.image} />
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Image source={{ uri: item.mediaUrl }} style={styles.video} resizeMode="cover" />
                                        </Fragment>
                                    )
                                )}

                                {item.message && (
                                    <Text style={styles.messageText}>{item.message}</Text>
                                )}

                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                                    {/* <Ionicons name={"checkmark"} color={colors.neturalcolour.gray_2} size={18} /> */}
                                    {getstatus[item.status]}
                                </View>
                            </TouchableOpacity>
                            <Animated.View style={[styles.replyIconContainer, replyIconStyle]}>
                                <Feather name="corner-up-left" size={20} color="gray" />
                            </Animated.View>
                        </Animated.View>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </Fragment>
        );
    };

    return (
        <Fragment>
            <View style={{ display: "flex", gap: 15, paddingVertical: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 20 }}>
                <View style={{ flex: 1, display: "flex", gap: 15, flexDirection: "row", alignItems: "center", }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.5}>
                        <Ionicons name='arrow-back' color={colors.text.primary} size={20} />
                    </TouchableOpacity>
                    <View>
                        <Typography numberOfLines={1} styles={{}} variant="SmallTextBold">Bella Throne</Typography>
                        <Typography numberOfLines={1} styles={{}} variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3}>{moment().format("MMMM DD, YYYY - HH:mm A")}</Typography>
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <TouchableOpacity onPress={() => { }} activeOpacity={0.5} style={{ padding: 3, }}>
                        <Feather name='more-vertical' color={colors.text.primary} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} activeOpacity={0.5} style={{ padding: 3, }}>
                        <AntDesign name={isStar ? "star" : "staro"} color={isStar ? colors.warning.main : colors.text.primary} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50}>
                <ImageBackground source={{ uri: "https://i.pinimg.com/736x/51/61/81/51618193af1d58483b477bb8ec7b0224.jpg" }} resizeMode="cover" style={{ flex: 1, }}>
                    <FlatList
                        data={chatData}
                        renderItem={({ item }: { item: chatProps }) => <ChatMessage item={item} />}
                        contentContainerStyle={styles.container}
                    />

                    <View style={{ ...(Boolean(onReplayMessage) && { backgroundColor: colors.grey[300], }) }}>
                        {Boolean(onReplayMessage) &&
                            <View style={{ padding: 5, marginHorizontal: 20, backgroundColor: colors.grey[400] }}>
                                <Pressable onPress={() => { setOnReplayMessage(null) }} style={{ alignSelf: "flex-end", margin: 5 }}>
                                    <AntDesign name="close" size={20} color={colors.grey[600]} />
                                </Pressable>
                                <View style={{ height: 50, display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between", }}>
                                    <View>
                                        <Typography variant="SmallTextSemiBold">{onReplayMessage?.sender}</Typography>
                                        <Typography numberOfLines={1} variant="SmallerTextRegular">{onReplayMessage?.message}</Typography>
                                    </View>
                                    {onReplayMessage?.mediaUrl &&
                                        <Image source={{ uri: onReplayMessage?.mediaUrl }} resizeMode="cover" style={{ height: 40, width: 40, borderRadius: 8 }} />
                                    }
                                </View>
                            </View>
                        }
                        <View style={{ marginBottom: insets.bottom || 10, ...(!onReplayMessage && { paddingTop: 5 }), marginHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", gap: 15 }}>
                            {/* <View style={{ flex: 1 }}> */}
                            {/* <View style={{ height: 50, backgroundColor: "red" }}></View> */}
                            <View style={{ gap: 8, flex: 1, minHeight: 45, maxHeight: 110, borderRadius: (45 / 2), paddingHorizontal: 10, backgroundColor: colors.grey[300], display: "flex", flexDirection: "row", alignItems: "flex-end", }}>
                                <TouchableOpacity activeOpacity={.7} style={{ height: 45, alignItems: "center", justifyContent: "center" }}>
                                    <MaterialCommunityIcons name='sticker-emoji' color={colors.grey[700]} size={22} />
                                </TouchableOpacity>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        maxHeight: 110,
                                        minHeight: 45,
                                        textAlignVertical: "center",
                                        // paddingTop: 14,
                                        // paddingBottom: 10,
                                        // marginVertical: 5
                                    }}
                                    multiline={true}
                                    placeholder="Message"
                                    placeholderTextColor={colors.grey[600]}
                                    value={message}
                                    onChangeText={(text) => setMessage(text)}
                                    onContentSizeChange={(event) => console.log({ height: event.nativeEvent.contentSize.height })}
                                />
                                {!message &&
                                    <TouchableOpacity activeOpacity={.7} style={{ height: 45, alignItems: "center", justifyContent: "center" }}>
                                        <Feather name='camera' color={colors.grey[700]} size={20} />
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity activeOpacity={.7} style={{ height: 45, alignItems: "center", justifyContent: "center" }}>
                                    <Feather name='plus' color={colors.grey[700]} size={22} />
                                </TouchableOpacity>
                            </View>
                            {/* </View> */}


                            {!message ?
                                <TouchableOpacity activeOpacity={.7} style={{ alignItems: "center", justifyContent: "center", width: 45, height: 45, borderRadius: (45 / 2), backgroundColor: colors.primary.main }}>
                                    <Ionicons name='send' color={colors.common.white} size={20} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={.7} style={{ alignItems: "center", justifyContent: "center", width: 45, height: 45, borderRadius: (45 / 2), backgroundColor: colors.primary.main }}>
                                    <Ionicons name='mic' color={colors.common.white} size={20} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {Platform.OS === "android" && isKeyboardVisible &&
                        <View style={{ height: 50 }} />
                    }
                </ImageBackground>
            </KeyboardAvoidingView>


            <Modal
                visible={Boolean(selectedMessage)}
                onRequestClose={() => { setSelectedMessage(null) }}
                transparent
                statusBarTranslucent
                animationType="slide"
            >
                <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} />
                <Pressable onPress={() => { setSelectedMessage(null) }} style={{ flex: 1 }} />
                <View style={{ gap: 15, backgroundColor: colors.grey[200], borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <View style={{ height: 55, borderBottomColor: colors.grey[400], borderStyle: "solid", borderBottomWidth: 1 }}>

                    </View>

                    <View style={{ paddingBottom: insets.bottom | 10, paddingHorizontal: 20 }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ height: 45, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <AntDesign name={"back"} size={18} color={colors.neturalcolour.gray_1} />
                            <Typography variant="SmallTextSemiBold" color={colors.neturalcolour.gray_1}>Reply</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ height: 45, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name={"return-up-forward"} size={18} color={colors.neturalcolour.gray_1} />
                            <Typography variant="SmallTextSemiBold" color={colors.neturalcolour.gray_1}>Forward</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ height: 45, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name={"share-social"} size={18} color={colors.neturalcolour.gray_1} />
                            <Typography variant="SmallTextSemiBold" color={colors.neturalcolour.gray_1}>Share</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ height: 45, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name={"copy-outline"} size={18} color={colors.neturalcolour.gray_1} />
                            <Typography variant="SmallTextSemiBold" color={colors.neturalcolour.gray_1}>Copy</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Fragment>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageContainer: {
        maxWidth: '80%',
        borderRadius: 10,
        padding: 8,
        marginVertical: 4,
    },
    left: {
        alignSelf: 'flex-start',
        backgroundColor: '#e1ffc7',
    },
    right: {
        alignSelf: 'flex-end',
        backgroundColor: '#d2e7ff',
    },
    forwardedText: {
        color: '#888',
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    replyContainer: {
        backgroundColor: '#f1f1f1',
        padding: 4,
        borderRadius: 5,
        marginBottom: 4,
    },
    replyText: {
        color: '#555',
        fontSize: 12,
    },
    replyUserText: {
        color: '#555',
        fontSize: 14,
        fontWeight: "600"
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 10,
        color: '#888',
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginVertical: 5,
    },
    video: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginVertical: 5,
    },
    replyIconContainer: {
        position: 'absolute',
        left: -30,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    messageWrapper: {
        marginVertical: 4,
        overflow: 'visible',
    },
});

export default ChatRoom;

const chatData: chatProps[] = [
    { id: 1, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Hey there! How are you?', sender: 'Alice', timestamp: '10:01 AM' },
    { id: 2, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'I’m good, thanks! What about you?', sender: 'Bob', timestamp: '10:02 AM' },
    { id: 3, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Doing well! Any plans for today?', sender: 'Alice', timestamp: '10:03 AM' },
    { id: 4, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Just work mostly. Maybe a movie later.', sender: 'Bob', timestamp: '10:04 AM' },
    { id: 5, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', message: 'Check out this view!', sender: 'Alice', timestamp: '10:05 AM' },
    { id: 6, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'That looks amazing! Where was this?', sender: 'Bob', replyTo: 5, timestamp: '10:06 AM' },
    { id: 7, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'It’s from my last vacation in Italy!', sender: 'Alice', timestamp: '10:07 AM' },
    { id: 8, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'video', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', message: 'Here’s a clip from my trip!', sender: 'Bob', timestamp: '10:08 AM' },
    { id: 9, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Great video! Looks fun!', sender: 'Alice', replyTo: 8, timestamp: '10:09 AM', forwarded: true },
    { id: 10, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Yeah, it was an awesome trip!', sender: 'Bob', timestamp: '10:10 AM' },
    { id: 11, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'What are your weekend plans?', sender: 'Alice', timestamp: '10:11 AM', forwarded: true },
    { id: 12, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Not sure yet. Maybe hiking?', sender: 'Bob', timestamp: '10:12 AM' },
    { id: 13, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Sounds fun! I might join.', sender: 'Alice', timestamp: '10:13 AM', forwarded: true },
    { id: 14, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Alice', timestamp: '10:14 AM' },
    { id: 15, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Love this photo! So peaceful.', sender: 'Bob', replyTo: 14, timestamp: '10:15 AM' },
    { id: 16, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'It’s from the beach last weekend.', sender: 'Alice', timestamp: '10:16 AM' },
    { id: 17, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Bob', timestamp: '10:17 AM' },
    { id: 18, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Nice! Is that a sunrise or sunset?', sender: 'Alice', replyTo: 17, timestamp: '10:18 AM' },
    { id: 19, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Sunset! The view was amazing.', sender: 'Bob', timestamp: '10:19 AM' },
    { id: 20, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'I wish I could’ve been there.', sender: 'Alice', timestamp: '10:20 AM' },
    { id: 21, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'video', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Bob', timestamp: '10:21 AM' },
    { id: 22, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Great catch! What a view!', sender: 'Alice', replyTo: 21, timestamp: '10:22 AM' },
    { id: 23, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Thank you! Wish you were there!', sender: 'Bob', timestamp: '10:23 AM' },
    { id: 24, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Next time for sure!', sender: 'Alice', timestamp: '10:24 AM' },
    { id: 25, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Do you have any plans for lunch?', sender: 'Bob', timestamp: '10:25 AM' },
    { id: 26, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Thinking of trying a new place.', sender: 'Alice', timestamp: '10:26 AM' },
    { id: 27, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Alice', timestamp: '10:27 AM' },
    { id: 28, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'That food looks delicious!', sender: 'Bob', replyTo: 27, timestamp: '10:28 AM' },
    { id: 29, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'It was! Highly recommend it.', sender: 'Alice', timestamp: '10:29 AM' },
    { id: 30, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'What’s the name of the place?', sender: 'Bob', timestamp: '10:30 AM' },
    { id: 31, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'It’s called The Green Spot.', sender: 'Alice', timestamp: '10:31 AM' },
    { id: 32, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'video', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Bob', timestamp: '10:32 AM', forwarded: true },
    { id: 33, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Looks like a cool spot!', sender: 'Alice', replyTo: 32, timestamp: '10:33 AM' },
    { id: 34, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Definitely! We should go together.', sender: 'Bob', timestamp: '10:34 AM' },
    { id: 35, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Alice', timestamp: '10:35 AM', },
    { id: 36, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Did you take this photo?', sender: 'Bob', replyTo: 35, timestamp: '10:36 AM' },
    { id: 37, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Yes! Learning some photography.', sender: 'Alice', timestamp: '10:37 AM' },
    { id: 38, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'You’re doing great! Looks professional.', sender: 'Bob', timestamp: '10:38 AM' },
    { id: 39, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'video', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Alice', timestamp: '10:39 AM' },
    { id: 40, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'This video is so relaxing.', sender: 'Bob', replyTo: 39, timestamp: '10:40 AM' },
    { id: 41, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Nature videos are my favorite.', sender: 'Alice', timestamp: '10:41 AM' },
    { id: 42, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'What’s your next destination?', sender: 'Bob', timestamp: '10:42 AM' },
    { id: 43, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Maybe the mountains this time!', sender: 'Alice', timestamp: '10:43 AM' },
    { id: 44, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'media', mediaType: 'image', mediaUrl: 'https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg', sender: 'Bob', timestamp: '10:44 AM', forwarded: true },
    { id: 45, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Love the view!', sender: 'Alice', replyTo: 44, timestamp: '10:45 AM' },
    { id: 46, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Thanks! It’s from last fall.', sender: 'Bob', timestamp: '10:46 AM' },
    { id: 47, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Let’s plan a trip soon!', sender: 'Alice', timestamp: '10:47 AM' },
    { id: 48, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Absolutely! Let’s pick a date.', sender: 'Bob', timestamp: '10:48 AM', forwarded: true },
    { id: 49, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Excited already!', sender: 'Alice', timestamp: '10:49 AM' },
    { id: 50, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Me too! Let’s make it happen!. Me too! Let’s make it happen!', sender: 'Bob', timestamp: '10:50 AM', forwarded: true },
    { id: 51, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Me too! Let’s make it happen!. Me too! Let’s make it happen!', replyTo: 49, sender: 'Bob', timestamp: '10:50 AM', forwarded: false },
    { id: 52, status: "seen", isEdit: false, isReacted: false, reactEmoji: "", type: 'text', message: 'Hi, there', sender: 'Bob', timestamp: '04:23 PM', forwarded: false },
    { id: 53, status: "send", isEdit: false, isReacted: false, reactEmoji: "", type: "textmedia", message: 'Checkout this', mediaUrl: "https://img.freepik.com/free-photo/top-close-up-view-vegetables-tomatoes-with-pedicels-garlic-bell-peppers-lemon-oil-onion_140725-72203.jpg", sender: 'Bob', timestamp: '05:23 PM', forwarded: false },
];
