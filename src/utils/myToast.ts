import {ToastAndroid} from 'react-native';

export const myToast = (message: string) => {
  return ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.TOP,
    0,
    240,
  );
};
