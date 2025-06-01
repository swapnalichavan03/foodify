import React, { ReactNode } from "react"

export interface headerProps {
    title?: string,
    isBack?: true | false,
    rightAction?: () => React.JSX.Element,
    leftAction?: () => React.JSX.Element,
}