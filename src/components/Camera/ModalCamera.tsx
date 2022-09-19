import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
} from 'react-native-vision-camera';
import {useGetCameraPermission} from '../../hooks';
import {invisibleColor} from '../../utils/color';
import {myToast} from '../../utils/myToast';
import Feather from 'react-native-vector-icons/Feather';
import {ImageObj} from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (img: ImageObj) => void;
  position?: 'front' | 'back';
}

interface CameraActionProps {
  icon: string;
  onPress: () => void;
  isActive: boolean;
}

const LoadingView = () => {
  return (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white', fontSize: 16}}>Waiting Camera</Text>
    </View>
  );
};

const CameraAction = ({icon, onPress, isActive}: CameraActionProps) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, {opacity: isActive ? 1 : 0}]}
      onPress={onPress}
      disabled={!isActive}>
      <Feather name={icon} color="white" size={22} />
    </TouchableOpacity>
  );
};

const ModalCamera = ({visible, onClose, onFinish, position}: Props) => {
  const [image, setImage] = useState<ImageObj>({} as ImageObj);
  const [cameraPosition, setCameraPosition] = useState(position || 'back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  useGetCameraPermission();

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;

  const toggleFlash = useCallback(() => {
    if (flash === 'off') {
      setFlash('on');
      return;
    }

    setFlash('off');
  }, [flash]);

  const toggleFlip = useCallback(() => {
    if (cameraPosition === 'back') {
      setCameraPosition('front');
      return;
    }

    setCameraPosition('back');
  }, [cameraPosition]);

  const onRetry = useCallback(() => {
    setImage({} as ImageObj);
  }, []);

  const onOk = useCallback(() => {
    onFinish(image);
    onClose();
    setTimeout(() => {
      setImage({} as ImageObj);
    }, 1000);
  }, [image]);

  const takePic = useCallback(async () => {
    const photo = await camera.current?.takeSnapshot({
      flash: flash,
      quality: 85,
      skipMetadata: true,
    });

    if (photo) {
      const {path} = photo;
      const namaFile = path.substr(path.lastIndexOf('/') + 1, path.length);
      setImage({
        uri: `file://${path}`,
        name: namaFile,
        type: 'image/jpeg',
      });
    }
  }, [camera.current, flash]);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent>
      {device == null ? (
        <LoadingView />
      ) : (
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor={invisibleColor}
          />
          <View style={styles.cameraContainer}>
            {image.uri ? (
              <Image
                source={{uri: image.uri}}
                resizeMode="cover"
                style={{aspectRatio: 9 / 16}}
              />
            ) : (
              <Camera
                ref={camera}
                style={{aspectRatio: 9 / 16}}
                device={device}
                isActive={visible}
                photo={true}
                onError={onError}
              />
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.actionSection}>
              {image.uri ? (
                <>
                  <TouchableOpacity onPress={onRetry}>
                    <Text style={styles.confirmButton}>Ulangi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onOk}>
                    <Text style={styles.confirmButton}>Ok</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <CameraAction
                    icon={flash === 'on' ? 'zap' : 'zap-off'}
                    onPress={toggleFlash}
                    isActive={supportsFlash}
                  />
                  <TouchableOpacity style={styles.capture} onPress={takePic} />
                  <CameraAction
                    icon="repeat"
                    onPress={toggleFlip}
                    isActive={supportsCameraFlipping}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCamera;

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  waitingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    paddingTop: ScreenHeight * 0.07,
  },
  actionSection: {
    backgroundColor: 'rgba(21, 21, 21, 0.25)',
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 14,
    padding: 8,
  },
  confirmButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
});
