import HLS from 'hls.js';
import { useEffect, useRef, useState } from 'react';

function App() {
  const videoRef = useRef();
  const hlsRef = useRef();
  const [ loading, setLoading ] = useState(false);
  const [ levels, setLevels ] = useState([]);
  const videoUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const loadLevel = (level) => {
    hlsRef.current
      && (hlsRef.current.currentLevel = level);
  };

  const handlePlay = () => {
    videoRef.current
      && videoRef.current.play();
  };

  const handlePause = () => {
    videoRef.current
      && videoRef.current.pause();
  };

  const handleLevelChange = (event) => {
    loadLevel(+event.target.value);
  };

  const subscribeToHLSEvents = () => {
    if (!hlsRef.current) return;

    hlsRef.current.on(HLS.Events.MANIFEST_PARSED, () => {
      setLevels(hlsRef.current.levels);
    });

    hlsRef.current.on(HLS.Events.LEVEL_SWITCHING, () => {
      setLoading(true);
    });

    hlsRef.current.on(HLS.Events.LEVEL_SWITCHED, () => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (HLS.isSupported) {
      hlsRef.current = new HLS();

      subscribeToHLSEvents();
      hlsRef.current.loadSource(videoUrl);
      hlsRef.current.attachMedia(videoRef.current);      
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        width="664"
        height="372"
      />

      <hr />

      <select
        onChange={handleLevelChange}
      >
        <option value={-1}>
          Auto
        </option>

        {
          levels.map((level, index) => (
            <option
              key={level.height}
              value={index}
            >
              {level.height}p
            </option>
          ))
        }
      </select>

      <button
        onClick={handlePlay}
      >
        Play
      </button>

      <button
        onClick={handlePause}
      >
        Pause
      </button>

      <br />

      { loading ? 'Loading...' : null }
    </>
  )
}

export default App
