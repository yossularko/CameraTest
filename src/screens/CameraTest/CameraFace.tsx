import * as React from 'react';
import {runOnJS} from 'react-native-reanimated';

import {StyleSheet, Text, View} from 'react-native';
import {useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';

import {Camera} from 'react-native-vision-camera';
import {scanFaces, Face} from 'vision-camera-face-detector';
import {useIsFocused} from '@react-navigation/native';

const CameraFace = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState<Face[]>();

  const devices = useCameraDevices();
  const device = devices.front;
  const isActive = useIsFocused();

  React.useEffect(() => {
    console.log(faces);
  }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  const faceObj = React.useMemo(() => {
    if(faces === undefined){
      return 'no face'
    }

    if(faces.length === 0){
      return 'no face'
    }

    return JSON.stringify(faces![0].bounds)
  }, [faces])

  return (
    <View style={styles.container}>
      {device != null && hasPermission ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          <View style={{height: 100, backgroundColor: 'rgba(21, 21, 21, 0.3)'}}>
            <Text style={{color: 'white'}}>
              Face: {faceObj}
            </Text>
          </View>
        </>
      ) : (
        <View>
          <Text>No Camera</Text>
        </View>
      )}
    </View>
  );
};

export default CameraFace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
