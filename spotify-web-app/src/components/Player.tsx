import React, { useState } from 'react';
import {
  View as RNView,
  Text as RNText, 
  Image as RNImage, 
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet,
  Platform 
} from 'react-native-web';
import { MaterialIcons } from '@expo/vector-icons';

interface Track {
  title: string;
  artist: string;
  thumbnail: string;
}

const Player: React.ComponentType = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(1);

  const renderControls = () => (
    <RNView style={styles.controls}>
      <RNTouchableOpacity 
        style={styles.iconButton}
        onPress={() => {/* Handle previous */}}
      >
        <MaterialIcons name="skip-previous" size={24} color="#FFFFFF" />
      </RNTouchableOpacity>
      
      <RNTouchableOpacity 
        style={[styles.iconButton, styles.playPauseButton]}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <MaterialIcons 
          name={isPlaying ? "pause" : "play-arrow"} 
          size={32} 
          color="#FFFFFF" 
        />
      </RNTouchableOpacity>
      
      <RNTouchableOpacity 
        style={styles.iconButton}
        onPress={() => {/* Handle next */}}
      >
        <MaterialIcons name="skip-next" size={24} color="#FFFFFF" />
      </RNTouchableOpacity>
    </RNView>
  );

  return (
    <RNView style={styles.container}>
      {currentTrack && (
        <>
          <RNView style={styles.trackInfo}>
            <RNImage 
              source={{ uri: currentTrack.thumbnail }}
              style={styles.artwork}
            />
            <RNView style={styles.textContainer}>
              <RNText style={styles.title}>{currentTrack.title}</RNText>
              <RNText style={styles.artist}>{currentTrack.artist}</RNText>
            </RNView>
          </RNView>

          {renderControls()}

          <input
            type="range"
            style={styles.volumeSlider}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            min={0}
            max={1}
            step={0.01}
          />
        </>
      )}
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282828',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
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
  }
});

export default Player;