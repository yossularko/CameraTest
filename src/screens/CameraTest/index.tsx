import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CameraTestParamList} from '../../types';

type Props = NativeStackScreenProps<CameraTestParamList, 'CameraTest'>;

const CameraTest = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <Text>CameraTest</Text>
      <Button title="QR Code" onPress={() => navigation.navigate('CameraQr')} />
      <Button
        title="Camera Labels"
        onPress={() => navigation.navigate('CameraLabel')}
      />
      <Button
        title="Face Detection"
        onPress={() => navigation.navigate('CameraFace')}
      />
    </View>
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
