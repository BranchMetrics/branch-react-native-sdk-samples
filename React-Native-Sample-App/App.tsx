import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/HomeScreen';
import ColorBlockScreen from './src/ColorBlockScreen';
import ReadDeepLinkScreen from './src/ReadDeepLinkScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Branch Sample App',
            headerTitleStyle: {
              fontFamily: 'Raleway-SemiBold',
            },
          }}
        />
        <Stack.Screen
          name="ColorBlockScreen"
          component={ColorBlockScreen}
          options={{
            title: 'Color Block Page',
            headerTitleStyle: {fontFamily: 'Raleway-SemiBold'},
          }}
        />
        <Stack.Screen
          name="ReadDeepLinkScreen"
          component={ReadDeepLinkScreen}
          options={{
            title: 'Read Deep Link Page',
            headerTitleStyle: {fontFamily: 'Raleway-SemiBold'},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
