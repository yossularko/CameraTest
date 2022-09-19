import {useEffect, useState} from 'react';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {myToast} from '../utils/myToast';

const useGetCameraPermission = () => {
  const [permission, setPermission] = useState<CameraPermissionStatus | ''>('');
  useEffect(() => {
    const checkCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'authorized') {
        setPermission(status);
        return;
      }

      const request = await Camera.requestCameraPermission();
      if (request === 'authorized') {
        setPermission(request);
        myToast(`Permission Camera ${request}`);
        return;
      }

      const getAgain = await Camera.getCameraPermissionStatus();
      setPermission(getAgain);
      myToast(`Permission Camera ${getAgain}`);
    };

    checkCameraPermission();
  }, []);

  return {permission};
};

export default useGetCameraPermission;
