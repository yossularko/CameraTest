import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {labelImage} from 'vision-camera-image-labeler';
import Feather from 'react-native-vector-icons/Feather';

import {Label} from '../../components/Camera/Label';
import {myToast} from '../../utils/myToast';

const CameraLabel = () => {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [hasPermission, setHasPermission] = useState(false);
  const currentLabel = useSharedValue('');
  const isFace = useSharedValue('');

  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const isActive = useIsFocused();

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );

  const toggleFlip = useCallback(() => {
    if (cameraPosition === 'back') {
      setCameraPosition('front');
      return;
    }

    setCameraPosition('back');
  }, [cameraPosition]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
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
        isFace.value = 'Wajah Terlihat';
      } else {
        isFace.value = 'No Face';
      }
      currentLabel.value = labels[0]?.label;
    },
    [currentLabel, isFace],
  );

  return (
    <View style={styles.container}>
      {device != null && hasPermission ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            frameProcessor={frameProcessor}
            frameProcessorFps={3}
          />
          <View style={styles.content}>
            <View style={{alignItems: 'center'}}>
              <Label sharedValue={currentLabel} />
            </View>
            <View style={styles.actionSection}>
              {supportsCameraFlipping && (
                <TouchableOpacity
                  style={[styles.actionButton, {marginRight: 20}]}
                  onPress={toggleFlip}>
                  <Feather name="repeat" color="white" size={28} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => myToast(isFace.value)}>
                <Feather name="aperture" color="white" size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}
    </View>
  );
};

export default CameraLabel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  actionSection: {
    backgroundColor: 'rgba(21, 21, 21, 0.3)',
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 14,
    padding: 8,
  },
});
