import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SafeAreaView } from 'react-native-web';

import Login from './components/Login';
import Callback from './components/Callback';
import AuthGuard from './components/AuthGuard';
import TabNavigator from './navigation/TabNavigator';

const App: React.FC = () => {
  return (
    <Router>
      <SafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: '#121212',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <Routes>
          <Route path="/" element={<AuthGuard><TabNavigator /></AuthGuard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </SafeAreaView>
    </Router>
  );
};

export default App;