import { useState, useEffect } from 'react';

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);
  const sceneKeys = Object.keys(durations);

  useEffect(() => {
    // @ts-ignore
    window.startRecording?.();

    let timeout: ReturnType<typeof setTimeout>;
    let isFirstPass = true;

    const advanceScene = (sceneIndex: number) => {
      const key = sceneKeys[sceneIndex];
      const duration = durations[key];

      timeout = setTimeout(() => {
        const nextScene = (sceneIndex + 1) % sceneKeys.length;
        if (nextScene === 0 && isFirstPass) {
          isFirstPass = false;
          // @ts-ignore
          window.stopRecording?.();
        }
        setCurrentScene(nextScene);
        advanceScene(nextScene);
      }, duration);
    };

    advanceScene(0);

    return () => clearTimeout(timeout);
  }, [durations, sceneKeys]);

  return { currentScene };
}