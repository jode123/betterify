import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Fix import paths by removing 'src'
import Login from './components/Login';
import Callback from './components/Callback';
import AuthGuard from './components/AuthGuard';
import TabNavigator from './navigation/TabNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Router>
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
          <Routes>
            <Route path="/" element={<AuthGuard><TabNavigator /></AuthGuard>} />
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </View>
      </Router>
    </SafeAreaProvider>
  );
};

export default App;