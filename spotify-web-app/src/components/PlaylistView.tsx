import React, { useEffect, useState } from 'react';
import { 
  View as RNView, 
  Text as RNText, 
  Image as RNImage, 
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet,
  ActivityIndicator as RNActivityIndicator
} from 'react-native-web';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import { spotifyApi } from '../services/spotifyApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

type RootStackParamList = {
  PlaylistDetails: { playlistId: string };
};

const PlaylistView = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useSpotifyAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (!accessToken) return;
        
        const response = await spotifyApi.getUserPlaylists(accessToken);
        setPlaylists(response.items);
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const renderPlaylistCard = ({ item }: { item: Playlist }) => {
    const defaultImage = { uri: 'https://via.placeholder.com/300' };
    
    const imageSource = item.images?.[0]?.url
      ? { uri: item.images[0].url }
      : defaultImage;

    return (
      <RNTouchableOpacity 
        style={styles.playlistCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('PlaylistDetails', { playlistId: item.id })}
      >
        <RNView style={styles.imageContainer}>
          {imageSource.uri ? (
            <RNImage 
              source={imageSource}
              style={styles.playlistImage}
              resizeMode="cover"
            />
          ) : (
            <MaterialIcons name="music-note" size={40} color="#666" />
          )}
        </RNView>
        <RNText style={styles.playlistName} numberOfLines={2}>
          {item.name || 'Untitled Playlist'}
        </RNText>
      </RNTouchableOpacity>
    );
  };

  if (loading) {
    return (
      <RNView style={styles.loadingContainer}>
        <RNActivityIndicator size="large" color="#1DB954" />
      </RNView>
    );
  }

  const EmptyListComponent = () => (
    <RNView style={styles.emptyContainer}>
      <MaterialIcons name="queue-music" size={48} color="#666" />
      <RNText style={styles.emptyText}>No playlists found</RNText>
    </RNView>
  );

  return (
    <RNView style={styles.container}>
      <RNText style={styles.title}>Your Playlists</RNText>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyListComponent />}
      />
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  grid: {
    padding: 8,
  },
  playlistCard: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#282828',
    overflow: 'hidden',
    maxWidth: (Dimensions.get('window').width - 48) / 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistImage: {
    width: '100%',
    height: '100%',
  },
  playlistName: {
    color: '#FFFFFF',
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: '#B3B3B3',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  }
});

export default PlaylistView;