import React, { Fragment, useState, } from 'react'
import { Pressable, TextInput, View, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { colors } from '../../theme/colors';
import { TextFieldMultilineProps } from './TextFieldMultiline';
import Typography from '../typography';
import { useStyles } from './styles';

const TextFieldMultiline = (props: TextFieldMultilineProps) => {
    const styles = useStyles();
    const [isFocus, setInFocus] = useState(false)

    return (
        <Fragment>
            <View style={{ gap: 5 }}>
                {props.lable && (
                    <Typography variant="SmallTextRegular">
                        {props.lable}
                    </Typography>
                )}

                <Pressable
                    style={[
                        {
                            borderColor: isFocus ? colors.primary.main : colors.input.border,
                            backgroundColor: props.disable === true ? colors.input.disable : colors.common.transparent,
                            height: !props.multiline ? 55 : props.size === "small" ? 40 : 55
                        },
                        styles.container
                    ]}
                >
                    {typeof props.startIcon === "function" && props.startIcon()}
                    <TextInput
                        {...props}
                        placeholderTextColor={colors.input.placeholder}
                        style={[styles.textinput, { height: !props.size ? 55 : props.size === "small" ? 40 : 55 }]}
                        onFocus={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                            setInFocus(true);
                            if (props.onFocus) {
                                props.onFocus(event)
                            }
                        }}
                        onBlur={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                            setInFocus(false);
                            if (props.onBlur) {
                                props.onBlur(event)
                            }
                        }}
                        readOnly={props.disable ? true : props.readOnly}
                        editable={props.disable ? true : props.editable}
                    />
                    {typeof props.endIcon === "function" && props.endIcon()}
                </Pressable>

                {props.isError && props.error && (
                    <Typography variant="SmallerTextRegular" color={colors.input.error}>
                        {props.error}
                    </Typography>
                )}
            </View>
        </Fragment>
    )
}

export default TextFieldMultiline
