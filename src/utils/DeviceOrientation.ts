import { NativeModules } from 'react-native';

const { DeviceOrientation } = NativeModules;

const getOrientation = async () => {
  return new Promise((resolve, reject) => {
    DeviceOrientation.getOrientation((orientation) => {
      if (orientation !== undefined) {
        resolve(orientation);
      } else {
        reject("Failed to get device orientation");
      }
    });
  });
};

const setOrientation = (orientation) => {
  DeviceOrientation.setOrientation(orientation);
};

export default {
  getOrientation,
  setOrientation,
};
