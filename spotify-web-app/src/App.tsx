import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import Login from './src/screens/Login';
import Callback from './src/screens/Callback';
import TabNavigator from './src/navigation/TabNavigator';
import AuthGuard from './src/components/AuthGuard';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#121212' }
          }}
        >
          <Stack.Screen 
            name="Main"
            component={AuthGuard}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Callback" component={Callback} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;