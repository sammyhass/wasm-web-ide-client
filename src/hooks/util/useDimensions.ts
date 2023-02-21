import { useEffect, useState } from 'react';

export function useWindowDimensions(): { width: number; height: number } {
  const [dims, setDims] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      if (typeof window === undefined) {
        return;
      }

      setDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dims;
}
