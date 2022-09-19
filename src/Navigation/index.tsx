import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CameraTest, CameraQR, CameraLabel, CameraFace} from '../screens';
import {CameraTestParamList} from '../types';

const Stack = createNativeStackNavigator<CameraTestParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{animation: 'none'}}>
        <Stack.Screen
          name="CameraTest"
          component={CameraTest}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraQr"
          component={CameraQR}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraLabel"
          component={CameraLabel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraFace"
          component={CameraFace}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
