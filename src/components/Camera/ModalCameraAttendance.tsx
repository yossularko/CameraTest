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
import React, {useCallback, useRef, useState} from 'react';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useGetCameraPermission} from '../../hooks';
import {invisibleColor} from '../../utils/color';
import {myToast} from '../../utils/myToast';
import {ImageObj} from '../../types';
import {useSharedValue} from 'react-native-reanimated';
import {labelImage} from 'vision-camera-image-labeler';
import {Label} from '../Camera/Label';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (img: ImageObj) => void;
}

const LoadingView = () => {
  return (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color="white" />
      <Text style={{color: 'white', fontSize: 16}}>Waiting Camera</Text>
    </View>
  );
};

const ModalCameraAttendance = ({visible, onClose, onFinish}: Props) => {
  const [image, setImage] = useState<ImageObj>({} as ImageObj);

  useGetCameraPermission();

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front;

  const currentLabel = useSharedValue('');

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
    if (currentLabel.value === 'Wajah tidak terlihat 😴') {
      console.log(currentLabel.value);
      return;
    }

    try {
      const photo = await camera.current?.takeSnapshot({
        flash: 'off',
        quality: 85,
        skipMetadata: true,
      });

      if (photo) {
        const {path} = photo;
        const namaFile = path.substring(path.lastIndexOf('/') + 1, path.length);
        setImage({
          uri: `file://${path}`,
          name: namaFile,
          type: 'image/jpeg',
        });
      }
    } catch (err: any) {
      myToast(String(err));
      console.log('error capture: ', String(err));
    }
  }, [camera.current]);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.log('Error Camera: ', error);
    myToast(error.message);
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const labels = labelImage(frame);

      const liststes = labels.map(item => item?.label).slice(0, 5);
      if (
        liststes.indexOf('Cool') !== -1 ||
        liststes.indexOf('Selfie') !== -1 ||
        liststes.indexOf('Smile') !== -1
      ) {
        currentLabel.value = 'Camera Siap 🥳';
      } else {
        currentLabel.value = 'Wajah tidak terlihat 😴';
      }
    },
    [currentLabel],
  );

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
                style={{aspectRatio: 3 / 4}}
              />
            ) : (
              <Camera
                ref={camera}
                style={{aspectRatio: 3 / 4}}
                device={device}
                isActive={visible}
                photo={true}
                onError={onError}
                frameProcessor={frameProcessor}
                frameProcessorFps={3}
              />
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              {!image.uri && <Label sharedValue={currentLabel} />}
            </View>
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
                <TouchableOpacity style={styles.capture} onPress={takePic} />
              )}
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default ModalCameraAttendance;

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
  labelContainer: {
    height: 100,
    alignItems: 'center',
    marginTop: StatusBar.currentHeight,
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
