import { MusicPlayer } from './MusicPlayer'

export interface MusicPlayerProps {
  name: string;
  artist: string;
}

export function MusicPlayer({ name, artist }: MusicPlayerProps) {
  return (
    <div className="flex items-center p-4 hover:bg-[var(--background-secondary)] rounded-lg transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="text-[var(--text-primary)] font-medium">{track.name}</div>
        <div className="text-[var(--text-secondary)] text-sm">{track.artist}</div>
      </div>
      <MusicPlayer name={track.name} artist={track.artist} />
    </div>
  )
}