import React, { Fragment, useState } from 'react'
import { Image, StyleProp, ImageStyle, ImageURISource, ImageRequireSource, ImageResizeMode, ImageSourcePropType, ImageLoadEventData, ImageErrorEventData, ImageProgressEventDataIOS, NativeSyntheticEvent, View, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';

export interface RNImageProps {
    resizeMethod?: "auto" | "resize" | "scale",
    resizeMode?: ImageResizeMode,
    source?: ImageSourcePropType | undefined,
    onError?: | ((error: NativeSyntheticEvent<ImageErrorEventData>) => void) | undefined,
    onLoad?: | ((event: NativeSyntheticEvent<ImageLoadEventData>) => void) | undefined,
    onLoadStart?: (() => void) | undefined,
    onLoadEnd?: (() => void) | undefined,
    onProgress?: | ((event: NativeSyntheticEvent<ImageProgressEventDataIOS>) => void) | undefined,
    progressiveRenderingEnabled?: boolean | undefined,
    borderRadius?: number | undefined,
    borderTopLeftRadius?: number | undefined,
    borderTopRightRadius?: number | undefined,
    borderBottomLeftRadius?: number | undefined,
    borderBottomRightRadius?: number | undefined,
    defaultSource?: ImageURISource | ImageRequireSource | undefined,
    alt?: string | undefined,
    height?: number | undefined,
    width?: number | undefined,
    style?: StyleProp<ImageStyle> | undefined
}
const RNImage = ({ resizeMethod, resizeMode, source, onError, onLoad, onLoadStart, onLoadEnd, onProgress, progressiveRenderingEnabled, borderRadius, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius, defaultSource, alt, height, width, style }: RNImageProps) => {
    const [onLoading, setOnLoading] = useState<true | false>(false);
    const [isError, setIsError] = useState<true | false>(false);

    return (
        <Fragment>
            <View style={[style, { overflow: "hidden", alignItems: "center", justifyContent: "center" }]}>
                {onLoading && <ActivityIndicator size={"small"} color={colors.primary.main} style={{position:"absolute", zIndex: 999}} />}
                <Image
                    resizeMethod={resizeMethod}
                    resizeMode={resizeMode}
                    source={source ? source : require("../../assets/app/foodify_app_icon.png")}
                    onError={(event) => {
                        if (onError) {
                            onError(event)
                        }
                    }}

                    onLoadStart={() => {
                        // setOnLoading(true)
                        if (onLoadStart) {
                            onLoadStart()
                        }
                    }}
                    onLoadEnd={() => {
                        setOnLoading(false)
                        if (onLoadEnd) {
                            onLoadEnd()
                        }
                    }}
                    onLoad={(event) => {
                        setOnLoading(false)
                        if (onLoad) {
                            onLoad(event)
                        }
                    }}


                    onProgress={(event) => {
                        if (onProgress) {
                            onProgress(event)
                        }
                    }}
                    progressiveRenderingEnabled={progressiveRenderingEnabled}
                    borderRadius={borderRadius}
                    borderTopLeftRadius={borderTopLeftRadius}
                    borderTopRightRadius={borderTopRightRadius}
                    borderBottomLeftRadius={borderBottomLeftRadius}
                    borderBottomRightRadius={borderBottomRightRadius}
                    defaultSource={defaultSource}
                    alt={alt}
                    height={height}
                    width={width}
                    style={{ width: "100%", height: "100%", }}
                />
            </View>
        </Fragment>
    )
}

export default RNImage
