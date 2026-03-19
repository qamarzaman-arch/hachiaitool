import { useEffect } from 'react';
import { useRecorderStore } from '@/features/recorder/useRecorderStore';

export function useRecorderSimulator() {
  const isRecording = useRecorderStore((state) => state.isRecording);
  const appendSimulatedEvent = useRecorderStore((state) => state.appendSimulatedEvent);

  useEffect(() => {
    if (!isRecording) return;

    const interval = window.setInterval(() => {
      appendSimulatedEvent();
    }, 4500);

    return () => window.clearInterval(interval);
  }, [appendSimulatedEvent, isRecording]);
}
