import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export type WindowScreen = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
};

const windowInfo = {
  xs: 768,
  sm: 992,
  md: 1200,
  lg: 1920,
};

export function useAdaptive() {
  const { width, height } = useWindowSize();

  const isMobile = useMemo(() => {
    return width < 768;
  }, [width]);

  const adaptive = useMemo((): WindowScreen => {
    return {
      xs: width < windowInfo.xs,
      sm: width >= windowInfo.xs && width < windowInfo.sm,
      md: width >= windowInfo.sm && width < windowInfo.md,
      lg: width >= windowInfo.md && width < windowInfo.lg,
      xl: width >= windowInfo.lg,
    };
  }, [width]);

  return {
    width,
    height,
    isMobile,
    adaptive,
  };
}
