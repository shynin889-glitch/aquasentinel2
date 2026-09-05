import { useCallback, useEffect, useRef, useState } from "react";

export const STAGES = [
  "Uploading scan",
  "Validating sonar data",
  "Preprocessing imagery",
  "Running AI detection",
  "Calculating confidence scores",
  "Generating report",
] as const;

export function useProcessing() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const start = useCallback((f: File, onComplete?: () => void) => {
    setFile(f);
    setProgress(0);
    setDone(false);
    setRunning(true);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + (p < 30 ? 6 : p < 70 ? 4 : 3));
        if (next >= 100) {
          if (timer.current) clearInterval(timer.current);
          setRunning(false);
          setDone(true);
          onComplete?.();
        }
        return next;
      });
    }, 160);
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setFile(null);
    setProgress(0);
    setRunning(false);
    setDone(false);
  }, []);

  const stageIndex = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));

  return { file, progress, running, done, start, reset, stageIndex };
}
