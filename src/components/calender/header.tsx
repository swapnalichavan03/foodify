import React, { Dispatch, SetStateAction, Fragment } from 'react'
import moment from 'moment';
import { Pressable, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import { monthLarge } from '../../utils/months';
import { colors } from '../../theme/colors';
import Typography from '../typography';

export interface HeaderProps {
    disablePast: true | false,
    disableFuture: true | false,
    isYears: true | false,
    currentMonth: number,
    currentYear: number,
    setCurrentYear: Dispatch<SetStateAction<number>>,
    setIsYears: Dispatch<SetStateAction<true | false>>,
    setCurrentMonth: Dispatch<SetStateAction<number>>,
};

const Header = ({
    disablePast = false,
    disableFuture = false,
    isYears = false,
    currentYear = Number(moment().format("YYYYY")),
    currentMonth = Number(moment().format("MM")),
    setIsYears = () => { },
    setCurrentYear = () => { },
    setCurrentMonth = () => { },
}: HeaderProps) => {

    return (
        <Fragment>
            <View style={{ paddingVertical: 15, paddingHorizontal: 15, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        if (currentMonth === 1) {
                            setCurrentYear(currentYear - 1)
                            setCurrentMonth(12)
                            return
                        } else {
                            return setCurrentMonth(currentMonth - 1)
                        }
                    }}
                    disabled={disablePast && moment(/* currentDate */).format("M/yyyy") === `${currentMonth}/${currentYear}`}
                    activeOpacity={0.70}
                    style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 6, borderWidth: 1, borderColor: colors.grey[400], borderStyle: "solid" }}
                >
                    <AntDesign
                        name='arrowleft'
                        color={
                            disablePast && moment(/* currentDate */).format("M/yyyy") === `${currentMonth}/${currentYear}` ?
                                colors.grey[400]
                                :
                                colors.grey[800]
                        }
                        size={16}
                    />
                </TouchableOpacity>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0 }}>
                    <Typography variant="MediumTextRegular">
                        {monthLarge.find((item) => item?.month === currentMonth)?.name},{" "}
                    </Typography>
                    <Typography variant="MediumTextRegular">
                        {currentYear}
                    </Typography>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (currentMonth === 12) {
                            setCurrentYear(currentYear + 1)
                            setCurrentMonth(1)
                            return;
                        } else {
                            return setCurrentMonth(currentMonth + 1)
                        }
                    }}
                    disabled={disableFuture && moment(/* currentDate */).format("M/yyyy") === `${currentMonth}/${currentYear}`}
                    activeOpacity={0.70}
                    style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 6, borderWidth: 1, borderColor: colors.grey[400], borderStyle: "solid" }}
                >
                    <AntDesign
                        name='arrowright'
                        color={
                            disableFuture && moment(/* currentDate */).format("M/yyyy") === `${currentMonth}/${currentYear}` ?
                                colors.grey[400]
                                :
                                colors.grey[800]
                        }
                        size={16}
                    />
                </TouchableOpacity>
            </View>
        </Fragment>
    )
}

export default Header
