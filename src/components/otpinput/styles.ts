import { StyleSheet } from 'react-native';
import { colors } from "../../theme/colors"
import { Fonts, FontWeight } from "../../theme/fonts"

export const styles = StyleSheet.create({
  otpContainer: {
    display: 'flex',
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    justifyContent: "space-between"
  },
  otpInput: {
    width: 42,
    height: 42,
    backgroundColor: colors.common.white,
    borderRadius: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    color: colors.input.text,
    fontSize: 11,
    fontFamily: Fonts.PoppinsRegular,
    fontWeight: FontWeight.PoppinsRegular,
  },
});
