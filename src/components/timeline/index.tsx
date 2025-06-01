import React, { Fragment } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const data = [
    { id: 1, isActive: true, leftLabel: 'Step 1', rightLabel: 'Description 1' },
    { id: 2, isActive: true, leftLabel: 'Step 2', rightLabel: 'Description 2' },
    { id: 3, isActive: true, leftLabel: 'Step 3', rightLabel: 'Description 3' },
    { id: 4, isActive: true, leftLabel: 'Step 4', rightLabel: 'Description 4' },
    { id: 5, isActive: true, leftLabel: 'Step 5', rightLabel: 'Description 5' },
    { id: 6, isActive: true, leftLabel: 'Step 6', rightLabel: 'Description 6' },
    { id: 7, isActive: false, leftLabel: 'Step 7', rightLabel: 'Description 7' },
    { id: 8, isActive: false, leftLabel: 'Step 8', rightLabel: 'Description 8' },
];

const Timeline = () => {
    return (
        <Fragment>
            {data.map((value, index) => {
                const firstIndex = index !== 0

                return (
                    <View style={{ alignItems: "flex-start", width: "auto" }}>
                        <View key={index} style={{ alignItems: "flex-start" }}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
                                <Text style={{ width: 60, bottom: 10 }}>{value.leftLabel}</Text>
                                <View style={{}}>
                                    {firstIndex &&
                                        <View
                                            style={{
                                                width: 12,
                                                height: 35,
                                                backgroundColor:  value.isActive ? "#0093BB" : "#D6D6D6",
                                            }}
                                        />
                                    }
                                    <View style={{ height: 35, width: 12, alignItems: "center", justifyContent: 'center' }}>
                                        <View style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: (12 / 2),
                                            backgroundColor: value.isActive ? "#0093BB" : "#D6D6D6",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {!value.isActive &&
                                                <View style={{ backgroundColor: "#FFFFFF", width: 8, height: 8, borderRadius: (8 / 2) }} />
                                            }
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ bottom: 10 }}>{value.rightLabel}</Text>
                            </View>


                        </View>
                    </View>
                )
            })}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    leftLabelContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    rightLabelContainer: {
        flex: 1,
        paddingLeft: 8,
    },
    labelText: {
        fontSize: 16,
        color: '#333',
    },
    lineContainer: {
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF',
    },
    line: {
        width: 12,
        height: 35,
        backgroundColor: '#007AFF',
        marginTop: 2,
    },
});

export default Timeline;
