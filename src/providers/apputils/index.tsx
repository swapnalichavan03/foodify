import React, { ComponentType, Fragment, useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getprofile } from '../../service';
import { setProfile } from '../../store/reducers/userprofile';
import { View } from 'react-native';
import { colors } from '../../theme/colors';
import { ActivityIndicator } from 'react-native';
import { StorageManager } from '../../helpers/localstorage/StorageManager';
import { useAppSelector } from '../../hooks/useAppSelector';
import { RootState } from '../../store';
import { setNotificationSound } from '../../store/reducers/notificationsound';

const AppUtils = <P extends object>(ConsumerComponent: ComponentType<P>) => {
    return (props: P) => {
        const dispatch = useAppDispatch();
        const { notification } = useAppSelector((state: RootState) => state.notificationsound)
        const [isLoading, setIsLoading] = useState<true | false>(true)

        useEffect(() => {
            (async () => {
                await getprofile()
                    .then((response) => {
                        if (response.status === 200) {
                            dispatch(setProfile({ profile: response.data.profile }))
                        }
                    })
                    .catch((error) => {
                        console.log("error.getprofile", error)
                    })
                    .finally(() => { setIsLoading(false) })
            })()
        }, []);

        useEffect(() => {
            (async () => {
                StorageManager.getNotificationSetting()
                    .then((response) => {
                        if (typeof response === null) {
                            // StorageManager.setNotificationSetting(notification)
                        } else if (typeof response === undefined) {
                            // StorageManager.setNotificationSetting(notification)
                        } else if(response !== null) {
                            dispatch(setNotificationSound({
                                sound: response
                            }))
                        }
                    })
            })()
        }, [])

        if (isLoading) {
            return (
                <View style={{ backgroundColor: colors.grey[200], flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator size={"large"} color={colors.success.dark} />
                </View>
            )
        }

        return (
            <Fragment>
                <ConsumerComponent {...props} />
            </Fragment>
        )
    }
}

export default AppUtils
