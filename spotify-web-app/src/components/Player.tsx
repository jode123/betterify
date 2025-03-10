import React, { useState } from 'react';
import {
  View,
  Text, 
  Image, 
  TouchableOpacity,
  StyleSheet,
  Platform 
} from 'react-native-web';
import { MaterialIcons } from '@expo/vector-icons';

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
        <MaterialIcons name="skip-previous" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.iconButton, styles.playPauseButton]}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <MaterialIcons 
          name={isPlaying ? "pause" : "play-arrow"} 
          size={32} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => {/* Handle next */}}
      >
        <MaterialIcons name="skip-next" size={24} color="#FFFFFF" />
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
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{currentTrack.title}</Text>
              <Text style={styles.artist}>{currentTrack.artist}</Text>
            </View>
          </View>

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
    </View>
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