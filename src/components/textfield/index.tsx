import React, { Fragment, useState, } from 'react'
import { Pressable, TextInput, View, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { colors } from '../../theme/colors';
import { TextFieldProps } from './TextField';
import Typography from '../typography';
import { useStyles } from './styles';
import { hexToRgb } from '../../utils/hexToRgb';


const TextField = (props: TextFieldProps) => {
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
          onPress={(event) => {
            if (props.onPress) {
              props.onPress(event)
            }
          }}
          style={[
            {
              borderColor: props.isError ? hexToRgb(colors.error.main, .8) : isFocus ? colors.primary.main : colors.input.border,
              backgroundColor: props.disable === true ? colors.input.disable : colors.common.transparent,
              height: props.multiline === true ? props.height ? props.height : 55 : !props.size ? 55 : props.size === "small" ? 40 : 55,
              ...(props.multiline === true && { paddingVertical: 10 }),
            },
            styles.container
          ]}
        >
          {typeof props.startIcon === "function" && props.startIcon()}
          <TextInput
            {...props}
            placeholderTextColor={colors.input.placeholder}
            style={[
              styles.textinput,
              {
                height: props.multiline === true ? props.height ? props.height : 55 : !props.size ? 55 : props.size === "small" ? 40 : 55,
                ...(props.multiline === true && { paddingVertical: 10 }),
                ...(props.multiline === true && { textAlignVertical: "top", }),
              }
            ]}
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
  );
};

export default TextField
