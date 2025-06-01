import React, { Fragment, useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';
import { colors } from '../../theme/colors';

const OtpInput = ({ length = 6, onChangeOTP }: { length?: number; onChangeOTP?: (text: string) => void; }) => {
    const inputsRef = useRef<any[]>([]); // Ensure this is an array
    const [activeFocus, setActiveFocus] = useState<number | undefined>(undefined);
    const [otp, setOtp] = useState<string[]>(Array.from({ length: length }, () => ''));

    const onChangeInput = (index: number, value: string) => {
        const newOtp = [...otp];

        if (value.length > 1) {
            // Handle paste
            const pastedValues = value.slice(0, length - index).split('');
            pastedValues.forEach((char, i) => {
                if (index + i < length) {
                    newOtp[index + i] = char;
                }
            });

            setOtp(newOtp);

            if (onChangeOTP) {
                onChangeOTP(newOtp.join(''));
            }

            // Move focus to the next empty input
            const nextIndex = index + pastedValues.length;
            if (nextIndex < length) {
                inputsRef.current[nextIndex]?.focus();
                setActiveFocus(nextIndex);
            } else {
                setActiveFocus(undefined); // No more inputs to focus
            }
        } else {
            // Handle single character input
            newOtp[index] = value;
            setOtp(newOtp);

            if (onChangeOTP) {
                onChangeOTP(newOtp.join(''));
            }

            // Focus next input
            if (value && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
                setActiveFocus(index + 1);
            }
        }
    };

    return (
        <Fragment>
            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        value={value}
                        onChangeText={(text) => onChangeInput(index, text)}
                        placeholder="0"
                        placeholderTextColor={colors.input.placeholder}
                        caretHidden={true}
                        style={[
                            styles.otpInput,
                            index === activeFocus
                                ? { borderColor: colors.primary.main }
                                : { borderColor: colors.input.border },
                        ]}
                        onFocus={() => setActiveFocus(index)}
                        ref={(ref) => (inputsRef.current[index] = ref)} // Store ref in array
                        keyboardType="numeric"
                        inputMode="numeric"
                        textContentType="oneTimeCode"
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace' && !value && index > 0) {
                                inputsRef.current[index - 1]?.focus();
                                setActiveFocus(index - 1);
                            }
                        }}
                    />
                ))}
            </View>
        </Fragment>
    );
};

export default OtpInput;
