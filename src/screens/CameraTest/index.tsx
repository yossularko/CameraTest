import {StyleSheet, Text, View, Button, Image} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CameraTestParamList, ImageObj} from '../../types';
import ModalCamera from '../../components/Camera/ModalCamera';
import {useDisclosure} from '../../hooks';
import {imageFallback} from '../../utils/imageFallback';

type Props = NativeStackScreenProps<CameraTestParamList, 'CameraTest'>;

const CameraTest = ({navigation}: Props) => {
  const [image, setImage] = useState({} as ImageObj);
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <ModalCamera
        visible={isOpen}
        onClose={onClose}
        onFinish={img => setImage(img)}
        position="back"
      />
      <View style={styles.container}>
        <Text>CameraTest</Text>
        <Image
          source={{uri: image.uri || imageFallback}}
          resizeMode="cover"
          style={{width: 200, height: 150}}
        />
        <View style={{marginTop: 10}}>
          <Button
            title="Capture"
            onPress={onOpen}
          />
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
});
