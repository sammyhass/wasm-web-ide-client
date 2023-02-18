import { useEffect, useState } from 'react';

export function useWindowDimensions(): { width: number; height: number } {
  const [dims, setDims] = useState({
    width: typeof window !== undefined ? window.innerWidth : 0,
    height: typeof window !== undefined ? window.innerWidth : 0,
  });

  useEffect(() => {
    function handleResize() {
      setDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dims;
}
