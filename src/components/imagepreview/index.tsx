import React, { Fragment, memo, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IImagesProps } from '../../screens/app/recipedetails/recipedetails';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { hexToRgb } from '../../utils/hexToRgb';
import { colors } from '../../theme/colors';
import Typography from '../typography';

interface IImagePreview {
    images: IImagesProps[],
    onDelete?: (value: IImagesProps) => void
    visible: true | false,
    onRequestClose: () => void,
    isDelete?: true | false
}
const { width, height } = Dimensions.get("screen")
const ImagePreview = ({ images, onDelete, visible, onRequestClose, isDelete = false }: IImagePreview) => {
    const insets = useSafeAreaInsets();
    const [currentPage, setCurrentPage] = useState<number>(0); // Track current page index
    const screenWidth = Dimensions.get("screen").width - 50; // Calculate screen width excluding padding

    const onScroll = (event: any) => {
        const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setCurrentPage(page); // Update the current page
    };

    useEffect(() => {
        if (images.length === 0) {
            if (onRequestClose) {
                onRequestClose()
            }
        }
    }, [images.length === 0])

    return (
        <Fragment>
            <Modal
                visible={visible}
                transparent
                onRequestClose={() => {
                    if (onRequestClose) {
                        onRequestClose()
                    }
                }}
                animationType="fade"
                statusBarTranslucent
            >
                <BlurView pointerEvents="none" blurAmount={1} blurType="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient pointerEvents="none" colors={[hexToRgb('#000000', .7), hexToRgb('#000000', .1), hexToRgb('#000000', .7)]} style={StyleSheet.absoluteFill} />

                <View style={{ height: height, width: width, }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        style={{ borderRadius: 12 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {images.map((image, index) => {
                            return (
                                <Image
                                    key={index}
                                    source={{ uri: image.url }}
                                    resizeMode="contain"
                                    style={{ height: "100%", width: width }}
                                />
                            )
                        })}
                    </ScrollView>
                </View>

                <View style={{ position: "absolute", top: insets.top, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        activeOpacity={.6}
                        onPress={() => {
                            if (onRequestClose) {
                                onRequestClose()
                            }
                        }}
                        style={{ display: "flex", flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <AntDesign name='close' color={colors.common.white} size={25} />
                        <Typography variant="SmallerTextSemiBold" color={colors.common.white}>Close</Typography>
                    </TouchableOpacity>
                </View>


                <View style={{ paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", position: "absolute", width: width, bottom: insets.bottom || 15 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5, flex: 1 }}>
                        {images.map((_, index) => {
                            return (
                                <View key={index} style={{ width: 10, height: 10, borderRadius: (10 / 2), backgroundColor: currentPage === index ? colors.primary.main : colors.grey[500] }} />
                            )
                        })}
                    </View>
                    {isDelete &&
                        <TouchableOpacity
                            activeOpacity={.6}
                            onPress={() => {
                                if (onDelete) {
                                    onDelete(images[currentPage])
                                }
                            }}
                            style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name='delete' color={colors.error.main} size={25} />
                            <Typography variant="SmallerTextSemiBold" color={colors.error.main}>Delete</Typography>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </Fragment>
    );
}

export default memo(ImagePreview, (prev, next) => {
    return (
        prev.images === next.images &&
        prev.onDelete === next.onDelete &&
        prev.visible === next.visible &&
        prev.onRequestClose === next.onRequestClose &&
        prev.isDelete === next.isDelete
    )
});
