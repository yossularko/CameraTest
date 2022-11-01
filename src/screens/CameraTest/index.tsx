import {StyleSheet, Text, View, Button, Image} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CameraTestParamList, ImageObj} from '../../types';
import ModalCamera from '../../components/Camera/ModalCamera';
import {useDisclosure} from '../../hooks';
import {imageFallback} from '../../utils/imageFallback';
import ModalCameraAttendance from '../../components/Camera/ModalCameraAttendance';

type Props = NativeStackScreenProps<CameraTestParamList, 'CameraTest'>;

const CameraTest = ({navigation}: Props) => {
  const [image, setImage] = useState({} as ImageObj);
  const [imageAttendance, setImageAttendance] = useState({} as ImageObj);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const {
    isOpen: isAttendance,
    onOpen: openAttendance,
    onClose: closeAttendance,
  } = useDisclosure();
  return (
    <>
      <ModalCamera
        visible={isOpen}
        onClose={onClose}
        onFinish={img => setImage(img)}
        position="back"
      />
      <ModalCameraAttendance
        visible={isAttendance}
        onClose={closeAttendance}
        onFinish={img => setImageAttendance(img)}
      />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={{width: '45%'}}>
            <Text>Camera Test</Text>
            <Image
              source={{uri: image.uri || imageFallback}}
              resizeMode="cover"
              style={{width: '100%', height: 150}}
            />
          </View>
          <View style={{width: '45%'}}>
            <Text>Camera Attendance</Text>
            <Image
              source={{uri: imageAttendance.uri || imageFallback}}
              resizeMode="cover"
              style={{width: '100%', height: 150}}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Button title="Capture" onPress={onOpen} />
          <Button title="Attendance" onPress={openAttendance} />
          <Button
            title="QR Code"
            onPress={() => navigation.navigate('CameraQr')}
          />
          <Button
            title="Camera Labels"
            onPress={() => navigation.navigate('CameraLabel')}
          />
          <Button
            title="Face Detection"
            onPress={() => navigation.navigate('CameraFace')}
          />
        </View>
      </View>
    </>
  );
};

export default CameraTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});
