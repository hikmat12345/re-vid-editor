'use client';

import { useRef, useState, useCallback } from 'react';

/**
 * Manages a single shared <audio> element for a list of tracks.
 * Only one track plays at a time; clicking the same track toggles pause/play.
 */
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = useCallback((id: string, url: string) => {
    if (!audioRef.current) return;

    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingId(id);
    }
  }, [playingId]);

  const onEnded = useCallback(() => setPlayingId(null), []);

  return { audioRef, playingId, togglePlay, onEnded };
}
