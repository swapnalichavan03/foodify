import { NativeModules, Platform } from 'react-native';

const { RCTTorch } = NativeModules;
export const useDeviceFlash = () => {
    const onDeviceFlash = (state: true | false, fill: "on" | "off") => {
        console.log("object", fill === "on")
        RCTTorch.switchState(fill === "on", (response: boolean) => {
            console.log("response", response)
        }, () => { })
    }

    return { onDeviceFlash }
}