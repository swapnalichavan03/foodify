import React, { Fragment } from 'react'
import { Dimensions, View } from 'react-native';
import Typography from '../typography';
import { colors } from '../../theme/colors';

const { height, width } = Dimensions.get("screen")
const Weeks = () => {

    return (
        <Fragment>
            <View style={{ width: (width - 30), alignSelf: "center", alignItems: "center", }}>
                <View style={{
                    borderTopColor: colors.grey[400],
                    borderBottomColor: colors.grey[400],
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderStyle: "solid",
                    paddingVertical: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {weeks.map((value: string, index: number) => {
                        return (
                            <View key={index} style={{ width: (width - 30) / 7, alignItems: "center", justifyContent: "center", }}>
                                <Typography  variant='MediumTextRegular'>{value}</Typography>
                            </View>
                        )
                    })}
                </View>
            </View>
        </Fragment>
    )
}

export default Weeks;
const weeks: string[] = ["S", "M", "T", "W", "T", "F", "S"]
