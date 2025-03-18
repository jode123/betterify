import { MusicPlayer } from './MusicPlayer'

export interface TrackProps {
  track: {
    name: string
    artist: string
    duration?: string
  }
  index?: number
}

export function Track({ track, index }: TrackProps) {
  return (
    <div className="flex items-center p-4 hover:bg-[var(--background-secondary)] rounded-lg transition-colors group">
      {index !== undefined && (
        <span className="text-[var(--text-secondary)] w-8">{index + 1}</span>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[var(--text-primary)] font-medium">{track.name}</div>
        <div className="text-[var(--text-secondary)] text-sm">{track.artist}</div>
      </div>
      <MusicPlayer
        trackName={track.name}
        artist={track.artist}
        onError={() => console.error('Playback error')}
        videoId=""  // Add appropriate video ID
        isPlaying={false}  // Add appropriate playing state
        onEnded={() => {}}  // Add appropriate end handler
      />
    </div>
  )
}