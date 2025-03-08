import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Use different slider implementations for web and native
const Slider = Platform.select({
  web: () => require('@react-native-community/slider/src/web/Slider').default,
  default: () => require('@react-native-community/slider').default,
})();

interface Track {
  title: string;
  artist: string;
  thumbnail: string;
}

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(1);

  const renderControls = () => (
    <View style={styles.controls}>
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => {/* Handle previous */}}
      >
        <Icon name="skip-previous" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.iconButton, styles.playPauseButton]}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Icon 
          name={isPlaying ? "pause" : "play-arrow"} 
          size={32} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => {/* Handle next */}}
      >
        <Icon name="skip-next" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTrack && (
        <>
          <View style={styles.trackInfo}>
            <Image 
              source={{ uri: currentTrack.thumbnail }}
              style={styles.artwork}
              // Add loading placeholder for web
              loading="lazy"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{currentTrack.title}</Text>
              <Text style={styles.artist}>{currentTrack.artist}</Text>
            </View>
          </View>

          {renderControls()}

          <Slider
            style={styles.volumeSlider}
            value={volume}
            onValueChange={setVolume}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#FFF"
            // Add web-specific props
            {...(Platform.OS === 'web' && {
              step: 0.01,
              'aria-label': 'Volume Control'
            })}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    // Add web-specific styles
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
    }),
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  artist: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  controlButton: {
    color: '#FFFFFF',
    fontSize: 24,
    paddingHorizontal: 20,
  },
  playPause: {
    fontSize: 32,
  },
  volumeSlider: {
    width: '100%',
  },
  iconButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  playPauseButton: {
    padding: 16,
    backgroundColor: '#1DB954',
  },
  // Add hover effects for web
  ...(Platform.OS === 'web' && {
    '@media (hover: hover)': {
      iconButton: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
      },
      playPauseButton: {
        ':hover': {
          backgroundColor: '#1ed760',
        },
      },
    },
  }),
});

export default Player;