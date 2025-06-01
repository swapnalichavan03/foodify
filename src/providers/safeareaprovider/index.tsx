import React, { Fragment } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const SafeArea = ({ children }: { children?: React.ReactNode }) => {

    return (
        <Fragment>
            <SafeAreaProvider>
                {children}
            </SafeAreaProvider>
        </Fragment>
    )
}

export default SafeArea
