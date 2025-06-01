import { useState, useEffect } from 'react';
import { getUniqueId, getDeviceId } from 'react-native-device-info';

interface DeviceInfo {
  uniqueId: string | null;
  deviceId: string | null;
}

export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    uniqueId: null,
    deviceId: null,
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const [uniqueId, deviceId] = await Promise.all([
          getUniqueId(),
          getDeviceId(),
        ]);

        setDeviceInfo({
          uniqueId,
          deviceId,
        });
      } catch (error) {
        console.error('Error fetching device info:', error);
        setDeviceInfo({
          uniqueId: null,
          deviceId: null,
        });
      }
    };

    fetchDeviceInfo();
  }, []);

  return deviceInfo;
};
