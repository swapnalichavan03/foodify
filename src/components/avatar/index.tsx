import React, { Fragment } from 'react';
import { Image, GestureResponderEvent, ImageResizeMode, View, Pressable } from 'react-native';
import Typography from '../typography';
import { colors } from '../../theme/colors';

export interface ImageURISource {
    uri?: string | undefined | null;
    bundle?: string | undefined;
    method?: string | undefined;
    headers?: { [key: string]: string } | undefined;
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached' | undefined;
    body?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    scale?: number | undefined;
}
export type ImageRequireSource = number;
export type ImageSourceProp =
    | ImageURISource
    | ImageURISource[]
    | ImageRequireSource;

const Avatar = ({
    onPress,
    source,
    alt,
    resizeMode,
    resizeMethod,
    width = 99,
    height = 99,
    borderRadius = 99 / 2,
}: {
    onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
    source: ImageSourceProp;
    alt?: string;
    resizeMode?: ImageResizeMode;
    resizeMethod?: 'auto' | 'resize' | 'scale';
    width?: 'auto' | number;
    height?: 'auto' | number;
    borderRadius?: number;
}) => {
    const isRemoteImage = (src: ImageSourceProp): src is { uri: string } => {
        return typeof src === 'object' && src !== null && 'uri' in src && !!src.uri;
    };
    
    return (
        <Pressable
            onPress={(event: GestureResponderEvent) => {
                if (onPress) {
                    onPress(event)
                }
            }}
        >
            {isRemoteImage(source) ? (
                <Image
                    source={source}
                    resizeMode={resizeMode}
                    resizeMethod={resizeMethod}
                    style={{ width, height, borderRadius }}
                />
            ) : (
                <View
                    style={{
                        backgroundColor: colors.grey[300],
                        justifyContent: 'center',
                        alignItems: 'center',
                        width,
                        height,
                        borderRadius,
                    }}
                >
                    <Typography variant="SmallTextBold">{alt?.charAt(0)}</Typography>
                </View>
            )}
        </Pressable>
    );
};

export default Avatar;
