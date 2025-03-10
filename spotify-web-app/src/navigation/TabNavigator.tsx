import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlaylistView from '../components/PlaylistView';

const TabNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/':
        return <PlaylistView />;
      default:
        return <PlaylistView />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => navigate('/')}
        >
          <Icon 
            name="library-music" 
            size={24} 
            color={location.pathname === '/' ? '#1DB954' : '#FFF'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  }
});

export default TabNavigator;