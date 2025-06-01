import React, { Fragment, Dispatch, SetStateAction, useState } from 'react'
import moment from 'moment';
import { getDaysArray } from '../../utils/getDaysArray'
import { Dimensions, NativeTouchEvent, TouchableOpacity, View } from 'react-native';
import Typography from '../typography';
import { colors } from '../../theme/colors';
export interface daysProps {
    "date": string,
    "day": {
        "large": string,  // Make sure this matches with the correct field name
        "small": string,
    },
    "isPrevMonth"?: true | false,
    "isNextMonth"?: true | false,
}
export interface DaysProps {
    currentDate: string,
    disablePast: true | false,
    disableFuture: true | false,
    weekOff: true | false,
    holidays: string[],
    isYears: true | false,
    currentMonth: number,
    currentYear: number,
    setCurrentYear: Dispatch<SetStateAction<number>>,
    setIsYears: Dispatch<SetStateAction<true | false>>,
    setCurrentMonth: Dispatch<SetStateAction<number>>,
    onChangeDate: (date: string) => void
}

const { height, width } = Dimensions.get("screen")
const Days = ({
    currentDate = moment().format(),
    disablePast = false,
    disableFuture = false,
    weekOff = false,
    holidays = [],
    currentMonth = Number(moment().format("MM")),
    setCurrentYear,
    currentYear = Number(moment().format("yyyy")),
    setCurrentMonth,
    onChangeDate,
}: DaysProps) => {
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    const disabledDateText = (date: string) => {
        let style = { color: colors.grey[900], cursor: "pointer" }
        if (moment(date).format("DD/MM/yyyy") === moment(currentDate).format("DD/MM/yyyy")) {
            style = { color: colors.common.white, cursor: "pointer" }
        } else if (disablePast && moment(date).format("MM/yyyy") < moment().format("MM/yyyy") && moment(date).format("yyyy") === moment().format("yyyy")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (disablePast && moment(date).format("yyyy") < moment().format("yyyy")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (disablePast && moment(date).format("MM/yyyy") === moment().format("MM/yyyy") && moment(date).format("DD") < moment().format("DD")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (disableFuture && moment(date).format("MM/yyyy") > moment().format("MM/yyyy") && moment(date).format("yyyy") === moment().format("yyyy")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (disableFuture && moment(date).format("yyyy") > moment().format("yyyy")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (disableFuture && moment(date).format("MM/yyyy") === moment().format("MM/yyyy") && moment(date).format("DD") > moment().format("DD")) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (weekOff && moment(date).day() === 0) {
            style = { color: colors.grey[400], cursor: "auto" }
        } else if (holidays?.map((item, i) => moment(item)?.format("DD/MM/yyyy"))?.includes(moment(date).format("DD/MM/yyyy"))) {
            style = { color: colors.grey[400], cursor: "auto" }
        }

        else {
            style = { color: colors.grey[900], cursor: "pointer" }
        }
        return style;
    };

    const minSwipeDistance = 50
    const onTouchStart = (e: any) => {
        // console.log(e?.nativeEvent?.targetTouches[0]?.screenX)
        // setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e?.nativeEvent?.targetTouches[0]?.screenX)
    }
    const onTouchMove = (e: any) => {
        // console.log(e?.nativeEvent?.targetTouches[0]?.screenX)
        setTouchEnd(e?.nativeEvent?.targetTouches[0]?.screenX)
    }
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe) {
            if (currentMonth === 12) {
                setCurrentYear(currentYear + 1)
                setCurrentMonth(1)
                return
            } else {
                return setCurrentMonth(currentMonth + 1)
            }
        } else if (isRightSwipe) {
            if (currentMonth === 1) {
                setCurrentYear(currentYear - 1)
                setCurrentMonth(12)
                return
            } else {
                return setCurrentMonth(currentMonth - 1)
            }
        }

    }

    return (
        <Fragment>
            <View
                // onTouchStart={(event) => { onTouchStart(event) }}
                // onTouchMove={(event) => { onTouchMove(event) }}
                // onTouchEnd={() => { onTouchEnd() }}
                style={{ width: (width - 30), /* height: ((((width - 30) / 7) * 6) + 20), */ paddingVertical: 10, alignSelf: "center", display: "flex", /* justifyContent: "center", */ flexDirection: "row", alignItems: "center", flexWrap: "wrap", }}>
                {getDaysArray(currentYear, currentMonth).map((value: daysProps, index: number) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (value.isPrevMonth) {
                                    if (disabledDateText(value.date).cursor === "auto") return
                                    onChangeDate(value?.date);
                                    setCurrentYear(Number(moment(value.date).format("YYYY")))
                                    setCurrentMonth(Number(moment(value.date).format("MM")))
                                }
                                if (value?.date) {
                                    if (disabledDateText(value.date).cursor === "auto") return
                                    onChangeDate(value?.date)
                                }
                                if (value.isNextMonth) {
                                    if (disabledDateText(value.date).cursor === "auto") return
                                    onChangeDate(value?.date);
                                    setCurrentYear(Number(moment(value.date).format("YYYY")))
                                    setCurrentMonth(Number(moment(value.date).format("MM")))
                                }
                            }}
                            key={index}
                            activeOpacity={0.70}
                            style={{
                                width: (width - 30) / 7,
                                height: (width - 30) / 7,
                                alignItems: "center",
                                justifyContent: "center",

                            }}
                        >
                            <View
                                style={{
                                    width: (((width - 30) / 7) - 10),
                                    height: (((width - 30) / 7) - 10),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    ...(value.date && {
                                        backgroundColor:
                                            moment(value?.date).format("DD/MM/yyyy") === moment(currentDate).format("DD/MM/yyyy") ?
                                                colors.primary.main
                                                :
                                                colors.common.transparent,
                                        borderRadius: ((((width - 30) / 7) - 10) / 2)
                                    }),
                                    ...(moment(value?.date).format("DD/MM/yyyy") === moment().format("DD/MM/yyyy") && {
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                        borderColor: colors.primary.main
                                    })
                                }}
                            >
                                <Typography
                                    variant='MediumTextRegular'
                                    color={value?.isPrevMonth ?
                                        colors.grey[500]
                                        :
                                        value?.isNextMonth ?
                                            colors.grey[500]
                                            :
                                            disabledDateText(value?.date as string).color
                                    }
                                >
                                    {value?.date &&
                                        moment(value?.date).format("DD")
                                    }
                                </Typography>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </Fragment>
    )
}

export default Days;
const weeks: string[] = ["S", "M", "T", "W", "T", "F", "S"]
