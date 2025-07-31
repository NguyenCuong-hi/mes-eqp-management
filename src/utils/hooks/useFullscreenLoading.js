import { useState, useCallback, useRef } from 'react';

export const useFullscreenLoading = () => {
  const [spinning, setSpinning] = useState(false);
  const [percent, setPercent] = useState(0);
  const intervalRef = useRef(null);

  const showLoader = useCallback((duration = 2000, onFinish = () => {}) => {
    setSpinning(true);
    const totalSteps = 100;
    const stepTime = duration / totalSteps;
    let ptg = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      ptg += 100 / totalSteps;
      setPercent(Math.min(ptg, 100));

      if (ptg >= 100) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSpinning(false);
        setPercent(0);
        onFinish();
      }
    }, stepTime);
  }, []);

  const hideLoader = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSpinning(false);
    setPercent(0);
  }, []);

  return {
    spinning,
    percent,
    showLoader,
    hideLoader,
  };
};
